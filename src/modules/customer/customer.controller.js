import catchAsync from "../../utils/catchAsync.js";
import {sendSuccess} from "../../utils/apiResponse.js";
import { createCustomer } from "./customer.service.js";

export const createCustomerController = catchAsync(
  async (req, res) => {
    const customer = await createCustomer(req.body);

    return sendSuccess(
      res,
      201,
      "Customer created successfully",
      customer
    );
  }
);