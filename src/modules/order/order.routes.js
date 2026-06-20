import { Router } from "express";
import validate from "../../middleware/validate.js";

import { createOrderSchema } from "./order.validation.js";

import {
  createOrderController, getOrderByIdController, cancelOrderController
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

export default orderRouter;