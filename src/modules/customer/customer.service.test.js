import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../../config/prisma.js';
import AppError from '../../utils/AppError.js';
import { 
  createCustomer, 
  getCustomers, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomer 
} from './customer.service.js';

const mockCustomerModel = {
  findUnique: () => {},
  create: () => {},
  findMany: () => {},
  count: () => {},
  update: () => {},
  delete: () => {}
};

const mockOrderModel = {
  count: () => {}
};

Object.defineProperty(prisma, 'customer', { value: mockCustomerModel, writable: true, configurable: true });
Object.defineProperty(prisma, 'order', { value: mockOrderModel, writable: true, configurable: true });

describe('Customer Service Unit Tests', () => {

  afterEach(() => {
    mock.reset();
  });

  describe('createCustomer', () => {
    test('should create a customer successfully if email is unique', async () => {
      const mockData = { email: 'test@example.com', name: 'John Doe' };
      
      mock.method(mockCustomerModel, 'findUnique', async () => null);
      mock.method(mockCustomerModel, 'create', async () => ({ id: 1, ...mockData }));

      const result = await createCustomer(mockData);

      assert.equal(result.id, 1);
      assert.equal(result.email, 'test@example.com');
    });

    test('should throw 409 error if email already exists', async () => {
      const mockData = { email: 'existing@example.com' };
      
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1, email: 'existing@example.com' }));

      await assert.rejects(
        async () => { await createCustomer(mockData); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 409);
          assert.equal(err.message, 'Email already exists');
          return true;
        }
      );
    });
  });

  describe('getCustomers', () => {
    test('should return paginated customers list', async () => {
      const mockCustomers = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
      
      mock.method(mockCustomerModel, 'findMany', async () => mockCustomers);
      mock.method(mockCustomerModel, 'count', async () => 2);

      const result = await getCustomers(1, 10);

      assert.deepEqual(result.customers, mockCustomers);
      assert.deepEqual(result.pagination, {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });
  });

  describe('getCustomerById', () => {
    test('should return customer if found', async () => {
      const mockCustomer = { id: 1, name: 'Alice' };
      mock.method(mockCustomerModel, 'findUnique', async () => mockCustomer);

      const result = await getCustomerById(1);
      assert.deepEqual(result, mockCustomer);
    });

    test('should throw 404 if customer is not found', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => null);

      await assert.rejects(
        async () => { await getCustomerById(999); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'Customer not found');
          return true;
        }
      );
    });
  });

  describe('updateCustomer', () => {
    test('should update customer data successfully', async () => {
      const mockCustomer = { id: 1, email: 'test@test.com' };
      const updateData = { name: 'Updated Name' };

      mock.method(mockCustomerModel, 'findUnique', async () => mockCustomer);
      mock.method(mockCustomerModel, 'update', async () => ({ ...mockCustomer, ...updateData }));

      const result = await updateCustomer(1, updateData);
      assert.equal(result.name, 'Updated Name');
    });

    test('should throw 404 if customer to update does not exist', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => null);

      await assert.rejects(
        async () => { await updateCustomer(999, { name: 'Ghost' }); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          return true;
        }
      );
    });
  });

  describe('deleteCustomer', () => {
    test('should delete customer if they have no orders', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1, email: 'test@test.com' }));
      mock.method(mockOrderModel, 'count', async () => 0);
      const deleteSpy = mock.method(mockCustomerModel, 'delete', async () => ({}));

      await deleteCustomer(1);
      
      assert.equal(deleteSpy.mock.callCount(), 1);
    });

    test('should throw 409 if customer has existing orders', async () => {
      mock.method(mockCustomerModel, 'findUnique', async () => ({ id: 1, email: 'test@test.com' }));
      mock.method(mockOrderModel, 'count', async () => 3);
      const deleteSpy = mock.method(mockCustomerModel, 'delete', async () => ({}));

      await assert.rejects(
        async () => { await deleteCustomer(1); },
        (err) => {
          assert.ok(err instanceof AppError);
          return true;
        }
      );
      
      assert.equal(deleteSpy.mock.callCount(), 0);
    });
  });
});