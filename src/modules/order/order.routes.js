import { Router } from "express";
import validate from "../../middleware/validate.js";

import { createOrderSchema, updateOrderStatusSchema } from "./order.validation.js";

import {
  createOrderController, getOrderByIdController, cancelOrderController, updateOrderStatusController
} from "./order.controller.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  validate(createOrderSchema),
  createOrderController
);

orderRouter.get(
  "/:id",
  getOrderByIdController
);

orderRouter.delete(
  "/:id",
  cancelOrderController
);

orderRouter.patch(
    "/:id/status",
    validate(updateOrderStatusSchema),
    updateOrderStatusController
);

export default orderRouter;