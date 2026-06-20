import catchAsync from "../../utils/catchAsync.js";
import  { sendSuccess } from "../../utils/ApiResponse.js";

import {executeNaturalLanguageQuery} from "./query.service.js";

export const queryController =
  catchAsync(async (req, res) => {

    const result =
      await executeNaturalLanguageQuery(
        req.body.query
      );

    return sendSuccess(
      res,
      200,
      "Query executed successfully",
    result,
    );
  });