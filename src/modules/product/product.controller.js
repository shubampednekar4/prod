import { sendSuccess } from "../../utils/apiResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct} from "./product.service.js";

export const createProductController = catchAsync(
    async ( req, res ) => {
        const product = await createProduct(req.body);
        return sendSuccess(
            res,
            201,
            'product created successfully',
            product
        )
    }
)

export const getProductController = catchAsync(
  async ( req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const category = req.query.category;
    const inStock = req.query.inStock;

    const productlist = await getProducts(
      page,
      limit,
      category,
      inStock
    );
    return sendSuccess(
      res,
      200,
      'Products Fethced successfully',
      productlist
    )
  }
)

export const getProductByIdController = catchAsync(
  async( req, res) => {
    const product = await getProductById(Number(req.params.id));
    return sendSuccess(
      res,
      200,
      'Product fetched',
      product
    )
  }
)

export const updateProductController = catchAsync(
  async ( req, res) => {
    const product = await updateProduct(Number(req.params.id), req.body);
    return sendSuccess(
      res, 
      301,
      'Product updated',
      product
    )
  }
)

export const deleteProductController = catchAsync(
  async( req, res) => {
    await deleteProduct(Number(req.params.id))
    return sendSuccess(
      res,
      200,
      'Product deleted',
      null
    )
  }
)