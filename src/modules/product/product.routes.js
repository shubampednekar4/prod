import express from "express";
import validate from "../../middleware/validate.js";
import { createProductSchema, updateProductSchema } from "./product.validation.js";
import { createProductController, getProductController, getProductByIdController, updateProductController, deleteProductController } from "../product/product.controller.js";

const productRouter = express.Router();

productRouter.post("/",
    validate(createProductSchema),
    createProductController
)
productRouter.get('/', getProductController);
productRouter.get('/:id', getProductByIdController);
productRouter.put('/:id', validate(updateProductSchema),updateProductController)
productRouter.delete('/:id', deleteProductController);

export default productRouter;