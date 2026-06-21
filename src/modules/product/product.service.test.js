import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import prisma from '../../config/prisma.js';
import AppError from '../../utils/AppError.js';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from './product.service.js';

const mockProductModel = {
  create: () => {},
  findMany: () => {},
  count: () => {},
  findUnique: () => {},
  update: () => {},
  delete: () => {}
};

const mockOrderItemModel = {
  count: () => {}
};

Object.defineProperty(prisma, 'product', { value: mockProductModel, writable: true, configurable: true });
Object.defineProperty(prisma, 'orderItem', { value: mockOrderItemModel, writable: true, configurable: true });

describe('Product Service Unit Tests', () => {

  afterEach(() => {
    mock.reset();
  });

  describe('createProduct', () => {
    test('should create a product successfully', async () => {
      const mockData = { name: 'Laptop', price: 999, stockQuantity: 10 };
      mock.method(mockProductModel, 'create', async () => ({ id: 1, ...mockData }));

      const result = await createProduct(mockData);

      assert.equal(result.id, 1);
      assert.equal(result.name, 'Laptop');
    });
  });

  describe('getProducts', () => {
    test('should return paginated products without filters', async () => {
      const mockProducts = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      mock.method(mockProductModel, 'findMany', async () => mockProducts);
      mock.method(mockProductModel, 'count', async () => 2);

      const result = await getProducts(1, 10);

      assert.deepEqual(result.products, mockProducts);
      assert.deepEqual(result.pagination, {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });

    test('should apply filters correctly when category and inStock are provided', async () => {
      const findManySpy = mock.method(mockProductModel, 'findMany', async () => []);
      const countSpy = mock.method(mockProductModel, 'count', async () => 0);

      await getProducts(1, 5, 'Electronics', 'true');

      const expectedWhere = {
        category: 'Electronics',
        stockQuantity: { gt: 0 }
      };

      assert.deepEqual(findManySpy.mock.calls[0].arguments[0].where, expectedWhere);
      assert.deepEqual(countSpy.mock.calls[0].arguments[0].where, expectedWhere);
    });
  });

  describe('getProductById', () => {
    test('should return product if found', async () => {
      const mockProduct = { id: 1, name: 'Phone' };
      mock.method(mockProductModel, 'findUnique', async () => mockProduct);

      const result = await getProductById(1);
      assert.deepEqual(result, mockProduct);
    });

    test('should throw 404 if product is not found', async () => {
      mock.method(mockProductModel, 'findUnique', async () => null);

      await assert.rejects(
        async () => { await getProductById(999); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'product not found');
          return true;
        }
      );
    });
  });

  describe('updateProduct', () => {
    test('should update product data successfully', async () => {
      const mockProduct = { id: 1, name: 'Old Name' };
      const updateData = { name: 'New Name' };

      mock.method(mockProductModel, 'findUnique', async () => mockProduct);
      mock.method(mockProductModel, 'update', async () => ({ ...mockProduct, ...updateData }));

      const result = await updateProduct(1, updateData);
      assert.equal(result.name, 'New Name');
    });

    test('should throw 404 if product to update does not exist', async () => {
      mock.method(mockProductModel, 'findUnique', async () => ({})); 

      await assert.rejects(
        async () => { await updateProduct(999, { name: 'Ghost' }); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 404);
          assert.equal(err.message, 'product not found');
          return true;
        }
      );
    });
  });

  describe('deleteProduct', () => {
    test('should delete product if it is not referenced in orders', async () => {
      mock.method(mockProductModel, 'findUnique', async () => ({ id: 1 }));
      mock.method(mockOrderItemModel, 'count', async () => 0);
      const deleteSpy = mock.method(mockProductModel, 'delete', async () => ({}));

      await deleteProduct(1);
      
      assert.equal(deleteSpy.mock.callCount(), 1);
    });

    test('should throw 409 if product is referenced by existing orders', async () => {
      mock.method(mockProductModel, 'findUnique', async () => ({ id: 1 }));
      mock.method(mockOrderItemModel, 'count', async () => 5); // 5 items exist
      const deleteSpy = mock.method(mockProductModel, 'delete', async () => ({}));

      await assert.rejects(
        async () => { await deleteProduct(1); },
        (err) => {
          assert.ok(err instanceof AppError);
          assert.equal(err.statusCode, 409);
          assert.equal(err.message, 'Cannot delete product because it is referenced by existing orders');
          return true;
        }
      );
      
      assert.equal(deleteSpy.mock.callCount(), 0);
    });
  });
});