import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import { generateSQL } from "../../services/gemini.service.js";
import { SQL_SYSTEM_PROMPT } from "./query.prompt.js";

import { validateGeneratedSQL,enforceLimit} from "./query.security.js";
import logger from "../../utils/logger.js";


export const executeNaturalLanguageQuery = async (naturalLanguageQuery) => {

    const aiResponse =
    await generateSQL(
        SQL_SYSTEM_PROMPT,
        naturalLanguageQuery
    );

    if (!aiResponse.sql) {
    throw new AppError(
        aiResponse.reasoning ||
        "Unable to generate query",
        400
    );
    }

    let generatedSQL =
    aiResponse.sql.trim();


    validateGeneratedSQL(
      generatedSQL
    );

    generatedSQL =
      enforceLimit(generatedSQL);
    let results;
    logger.info(`Generated SQL: ${generatedSQL}`);

    try {
      results =
        await prisma.$queryRawUnsafe(
 generatedSQL
        );

    } catch (error) {
      throw new AppError(
        "Failed to execute generated query",
        400
      );
    }

    return {
      naturalLanguageQuery,
      generatedSQL,
    reasoning: aiResponse.reasoning,
      results,
      rowCount: results.length,
    };
  };