import { Router } from "express";
import validate from "../../middleware/validate.js";
import {naturalLanguageQuerySchema} from "./query.validation.js";

import {queryController} from "./query.controller.js";

const queryRouter = Router();

queryRouter.post(
  "/",
  validate(
    naturalLanguageQuerySchema
  ),
  queryController
);

export default queryRouter;