import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";

export const createOrder = async (orderData) => {
  const { customerId, orderDate, items } = orderData;

  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  const productIds = items.map(
    (item) => item.productId
  );

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      "One or more products not found",
      404
    );
  }


  const productMap = new Map(
    products.map((product) => [
      product.id,
      product,
    ])
  );

  let totalAmount = 0;

  const orderItemsData = [];

  for (const item of items) {
    const product = productMap.get(
      item.productId
    );

    if (
      product.stockQuantity <
      item.quantity
    ) {
      throw new AppError(
        `Insufficient stock for ${product.name}`,
        400
      );
    }

    totalAmount +=
      Number(product.price) *
      item.quantity;

    orderItemsData.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: product.price,
    });
  }

  
  const order = await prisma.$transaction(
    async (tx) => {

      // Create Order

      const createdOrder =
        await tx.order.create({
          data: {
            customerId,
            orderDate: new Date(orderDate),
            totalAmount,
          },
        });

      // Bulk Create Order Items

      await tx.orderItem.createMany({
        data: orderItemsData.map(
          (item) => ({
            ...item,
            orderId: createdOrder.id,
          })
        ),
      });

      // Update Inventory

      for (const item of items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Return Complete Order

      return tx.order.findUnique({
        where: {
          id: createdOrder.id,
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }
  );

  return order;
};

export const getOrderById = async (id) => {

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  return order;
};

export const cancelOrder = async (id) => {

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new AppError(
      "Order not found",
      404
    );
  }

  if (order.status === "CANCELLED") {
    throw new AppError(
      "Order already cancelled",
      400
    );
  }
  if (
    !["PENDING", "CONFIRMED"].includes(
        order.status
    )
) {
    throw new AppError(
        "Only pending or confirmed orders can be cancelled",
        409
    );
}

  await prisma.$transaction(
    async (tx) => {

      for (const item of order.items) {

        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.order.update({
        where: {
          id: Number(id),
        },
        data: {
          status: "CANCELLED",
        },
      });
    }
  );

  return {
    message:
      "Order cancelled successfully",
  };
};

export const updateOrderStatus = async (
    id,
    status
) => {

    const order = await prisma.order.findUnique({
        where: {
            id
        }
    });

    if (!order) {
        throw new AppError(
            "Order not found",
            404
        );
    }

    const allowedTransitions = {
        PENDING: [
            "CONFIRMED",
            "CANCELLED"
        ],

        CONFIRMED: [
            "SHIPPED",
            "CANCELLED"
        ],

        SHIPPED: [
            "DELIVERED"
        ],

        DELIVERED: [],

        CANCELLED: []
    };

    const allowed =
        allowedTransitions[
            order.status
        ];

    if (
        !allowed.includes(status)
    ) {
        throw new AppError(
            `Cannot change status from ${order.status} to ${status}`,
            400
        );
    }

    const updatedOrder =
        await prisma.order.update({
            where: {
                id
            },
            data: {
                status
            }
        });

    return updatedOrder;
};