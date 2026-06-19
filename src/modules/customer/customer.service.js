import prisma from "../../config/prisma.js";

export const createCustomer = async (customerData) => {
    return prisma.customer.create({
        data : customerData
    })
}