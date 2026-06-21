import prisma from "../../config/prisma.js";
import AppError from "../../utils/AppError.js";
import { generateSQL } from "../../services/groq.service.js";
import { SQL_SYSTEM_PROMPT } from "./query.prompt.js";
import { 
  validateGeneratedSQL, 
  enforceLimit, 
  validateAllowedTables, 
  validateAllowedColumns 
} from "./query.security.js";
import logger from "../../utils/logger.js";

export const executeNaturalLanguageQuery = async (naturalLanguageQuery) => {
  const aiResponse = await generateSQL(
    SQL_SYSTEM_PROMPT,
    naturalLanguageQuery
  );

  if (!aiResponse.sql) {
    throw new AppError(
      aiResponse.reasoning || "The AI couldn't generate a valid database query for this request.",
      400
    );
  }

  let generatedSQL = aiResponse.sql.trim();

  validateGeneratedSQL(generatedSQL);
  validateAllowedTables(generatedSQL);
  validateAllowedColumns(generatedSQL); 
  
  generatedSQL = enforceLimit(generatedSQL);

  logger.info(`Generated SQL passed firewall: ${generatedSQL}`);

  let results;
  try {
    results = await prisma.$queryRawUnsafe(generatedSQL);
  } catch (error) {
    logger.error(`Database Runtime Execution Error: ${error.message} on query: ${generatedSQL}`);
    throw new AppError(
      "The generated database query syntax was invalid or failed execution.",
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