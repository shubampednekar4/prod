import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";

export const createProduct = async (productData) => {
    return await prisma.product.create({
        data : productData
    })
}

export const getProducts = async (
  page = 1,
  limit = 10,
  category,
  inStock
) => {

  const skip = (page - 1) * limit;

  const where = {};
  if(category){
    where.category = category;
  }
  if(inStock === 'true'){
    where.stockQuantity = {
        gt : 0,
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
        where
    }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductById = async(id) => {
    const product = await prisma.product.findUnique({
        where : {
            id
        }
    })
    if(!product) {
        throw new AppError(
            'product not found',
            404
        )
    }
    return product;
}

export const updateProduct = async (id, productData) => {
    const existingProduct = await prisma.product.findUnique({
        where : {
            id : id
        }
    })

    if(!existingProduct.id){
        throw new AppError(
            'product not found',
            404
        )
    }

    return prisma.product.update({
        where : {
            id
        },
        data : productData
    })
}

export const deleteProduct = async (id) => {

    const product = await prisma.product.findUnique({
        where : {
            id
        }
    })
    if(!product.id){
        throw new AppError(
            'product not found',
            404
        )
    }
    
    const orderItemCount = await prisma.orderItem.count({
        where : {
            productId : id
        }
    })

    if(orderItemCount > 0){
        throw new AppError(
            "Cannot delete product because it is referenced by existing orders",
            409
        )
    }

    await prisma.product.delete({
        where : {
            id
        }
    })
}