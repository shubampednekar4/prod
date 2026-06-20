import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
export const createCustomer = async (customerData) => {
    const existingCustomer = prisma.customer.findUnique({
        where : {
            email : customerData.email
        }
    })

    if(existingCustomer.email){
        throw new AppError(
            'Email already exists', 409
        )
    }
    return prisma.customer.create({
        data : customerData
    })
}

export const getCustomers = async (
  page = 1,
  limit = 10
) => {

  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.count(),
  ]);

  return {
    customers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCustomerById = async(id) => {
    const customer = await prisma.customer.findUnique({
        where : {
            id
        }
    })
    if(!customer) {
        throw new AppError(
            'Customer not found',
            404
        )
    }
    return customer;
}

export const updateCustomer = async (id, customerData) => {
    const existingCustomer = await prisma.customer.findUnique({
        where : {
            id : id
        }
    })

    if(!existingCustomer.email){
        throw new AppError(
            'customer not found',
            404
        )
    }

    return prisma.customer.update({
        where : {
            id
        },
        data : customerData
    })
}

export const deleteCustomer = async (id) => {

    const customer = await prisma.customer.findUnique({
        where : {
            id
        }
    })
    if(!customer.email){
        throw new AppError(
            'Customer not found',
            404
        )
    }

    const orderCount = await  prisma.order.count({
        where : {
            customerId : Number(id)
        }
    })
    
    if(orderCount > 0){
        throw new AppError(
            'cannot delete customer with existing order',
            409
        )
    }


    await prisma.customer.delete({
        where : {
            id
        }
    })
}