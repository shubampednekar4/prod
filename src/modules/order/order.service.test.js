import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../../config/prisma.js';
import AppError from '../../utils/AppError.js';
import { 
  createOrder, 
  getOrderById, 
  cancelOrder, 
  updateOrderStatus 
} from './order.service.js';

const mockCustomerModel = { findUnique: () => {} };
const mockProductModel = { findMany: () => {}, update: () => {} };
const mockOrderModel = { findUnique: () => {}, create: () => {}, update: () => {} };
const mockOrderItemModel = { createMany: () => {} };

const mockTxClient = {
  order: { create: () => {}, findUnique: () => {}, update: () => {} },
  orderItem: { createMany: () => {} },
  product: { update: () => {} }
};

Object.defineProperty(prisma, 'customer', { value: mockCustomerModel, writable: true, configurable: true });
Object.defineProperty(prisma, 'product', { value: mockProductModel, writable: true, configurable: true });
Object.defineProperty(prisma, 'order', { value: mockOrderModel, writable: true, configurable: true });
Object.defineProperty(prisma, 'orderItem', { value: mockOrderItemModel, writable: true, configurable: true });

Object.defineProperty(prisma, '$transaction', {
  value: async (callback) => await callback(mockTxClient),
  writable: true,
  configurable: true
});

describe('Order Service Unit Tests', () => {

  afterEach(() => {
    mock.reset();
  });

  describe('createOrder', () => {
    const validOrderData = {
      customerId: 1,
      orderDate: '2026-06-21',
      items: [{ productId: 101, quantity: 2 }]
    };

    test('should successfully process a valid order placement transaction', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1 }));
      mock.method(mockProductModel, 'findMany', async () => [{ id: 101, name: 'Gadget', price: 50, stockQuantity: 10 }]);
      
      mock.method(mockTxClient.order, 'create', async () => ({ id: 500 }));
      mock.method(mockTxClient.orderItem, 'createMany', async () => ({ count: 1 }));
      mock.method(mockTxClient.product, 'update', async () => ({}));
      
      const expectedFinalOrder = { id: 500, totalAmount: 100, items: [] };
      mock.method(mockTxClient.order, 'findUnique', async () => expectedFinalOrder);

      const result = await createOrder(validOrderData);
      
      assert.deepEqual(result, expectedFinalOrder);
    });

    test('should throw 404 if customer does not exist', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => null);

      await assert.rejects(
        async () => { await createOrder(validOrderData); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'Customer not found');
          return true;
        }
      );
    });

    test('should throw 404 if a selected product is missing from database', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1 }));
      mock.method(mockProductModel, 'findMany', async () => []); // Empty means product missing

      await assert.rejects(
        async () => { await createOrder(validOrderData); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'One or more products not found');
          return true;
        }
      );
    });

    test('should throw 400 if stock is insufficient', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1 }));
      mock.method(mockProductModel, 'findMany', async () => [{ id: 101, name: 'Gadget', price: 50, stockQuantity: 1 }]); // only 1 in stock, order asks for 2

      await assert.rejects(
        async () => { await createOrder(validOrderData); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 400);
          assert.match(err.message, /Insufficient stock/);
          return true;
        }
      );
    });
  });

  describe('getOrderById', () => {
    test('should return matched order schema if found', async () => {
      const mockOrder = { id: 123, totalAmount: 250 };
      mock.method(mockOrderModel, 'findUnique', async () => mockOrder);

      const result = await getOrderById(123);
      assert.deepEqual(result, mockOrder);
    });

    test('should throw 404 if order registry cannot be located', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => null);

      await assert.rejects(
        async () => { await getOrderById(999); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe('cancelOrder', () => {
    test('should safely cancel pending or confirmed orders and return inventory', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => ({
        id: 1,
        status: 'PENDING',
        items: [{ productId: 101, quantity: 2 }]
      }));
      
      const txProductUpdateSpy = mock.method(mockTxClient.product, 'update', async () => ({}));
      const txOrderUpdateSpy = mock.method(mockTxClient.order, 'update', async () => ({}));

      const result = await cancelOrder(1);

      assert.equal(txProductUpdateSpy.mock.callCount(), 1);
      assert.equal(txOrderUpdateSpy.mock.callCount(), 1);
      assert.equal(result.message, 'Order cancelled successfully');
    });

    test('should throw 400 if target order status is already CANCELLED', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => ({ id: 1, status: 'CANCELLED' }));

      await assert.rejects(
        async () => { await cancelOrder(1); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 400);
          assert.equal(err.message, 'Order already cancelled');
          return true;
        }
      );
    });

    test('should throw 409 if order is shipped/delivered and past cancellation period', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => ({ id: 1, status: 'SHIPPED' }));

      await assert.rejects(
        async () => { await cancelOrder(1); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 409);
          return true;
        }
      );
    });
  });

  describe('updateOrderStatus', () => {
    test('should transition status successfully if matching finite validation rules', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => ({ id: 1, status: 'PENDING' }));
      mock.method(mockOrderModel, 'update', async () => ({ id: 1, status: 'CONFIRMED' }));

      const result = await updateOrderStatus(1, 'CONFIRMED');
      assert.equal(result.status, 'CONFIRMED');
    });

    test('should reject transitions not predefined in status configuration mapping', async () => {
      mock.method(mockOrderModel, 'findUnique', async () => ({ id: 1, status: 'SHIPPED' }));

      await assert.rejects(
        async () => { await updateOrderStatus(1, 'CONFIRMED'); }, // Shipped can only go to Delivered
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 400);
          return true;
        }
      );
    });
  });
});