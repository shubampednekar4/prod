import catchAsync from "../../utils/catchAsync.js";
import {sendSuccess} from "../../utils/apiResponse.js";
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "./customer.service.js";

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

export const getCustomerController = catchAsync(
  async ( req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const customerlist = await getCustomers(
      page,
      limit
    );
    return sendSuccess(
      res,
      200,
      'Customer Fethced successfully',
      customerlist
    )
  }
)

export const getCustomerByIdController = catchAsync(
  async( req, res) => {
    const customer = await getCustomerById(Number(req.params.id));
    return sendSuccess(
      res,
      200,
      'Customer fetched',
      customer
    )
  }
)

export const updateCustomerController = catchAsync(
  async ( req, res) => {
    const customer = await updateCustomer(Number(req.params.id), req.body);
    return sendSuccess(
      res, 
      301,
      'Customer updated',
      customer
    )
  }
)

export const deleteCustomerController = catchAsync(
  async( req, res) => {
    await deleteCustomer(Number(req.params.id))
    return sendSuccess(
      res,
      200,
      'Customer deleted',
      null
    )
  }
)