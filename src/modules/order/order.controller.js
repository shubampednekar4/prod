import { createOrder, getOrderById, cancelOrder } from "./order.service.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendSuccess } from "../../utils/ApiResponse.js";

export const createOrderController = catchAsync(
  async (req, res) => {

    const order = await createOrder(req.body);

    return sendSuccess(
      res,
      201,
      "Order created successfully",
      order
    );
  }
);

export const getOrderByIdController = catchAsync(
  async (req, res) => {

    const order = await getOrderById(
      req.params.id
    );

    return sendSuccess(
      res,
      200,
      "Order fetched successfully",
      order,
    );
  }
);

export const cancelOrderController =
  catchAsync(async (req, res) => {

    const result =
      await cancelOrder(req.params.id);

    return sendSuccess(
      res,
      200,
      "Order cancelled successfully",
      result
    );
  });

export const updateOrderStatusController =
    catchAsync(async (req, res) => {

        const { status } = req.body;

        const order =
            await updateOrderStatus(
                Number(req.params.id),
                status
            );

        return sendSuccess(
            res,
            200,
            "Order status updated successfully",
            order,
        );
    });