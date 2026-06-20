import AppError from "../../utils/AppError.js";

const FORBIDDEN_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "GRANT",
  "REVOKE",
];

const ALLOWED_TABLES = [
  "customers",
  "products",
  "orders",
  "order_items",
];

const MAX_LIMIT = 100;

export const validateGeneratedSQL = (sql) => {

  const normalizedSql =
    sql.trim().toUpperCase();

  // Only SELECT

  if (
    !normalizedSql.startsWith("SELECT")
  ) {
    throw new AppError(
      "Only SELECT queries are allowed",
      400
    );
  }

  // Forbidden operations

for (const keyword of FORBIDDEN_KEYWORDS) {

  const regex = new RegExp(
    `\\b${keyword}\\b`,
    "i"
  );

  if (regex.test(sql)) {
    throw new AppError(
      `Forbidden SQL operation detected: ${keyword}`,
      400
    );
  }
}

  // Multiple statements

  const statements =
    sql.split(";").filter(
      (stmt) => stmt.trim()
    );

  if (statements.length > 1) {
    throw new AppError(
      "Multiple SQL statements are not allowed",
      400
    );
  }

  return true;
};

export const enforceLimit = (sql) => {

  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);

  if (!limitMatch) {
    return `${sql} LIMIT ${MAX_LIMIT}`;
  }

  const requestedLimit = Number(limitMatch[1]);

  if (requestedLimit > MAX_LIMIT) {
    throw new AppError(
      `LIMIT cannot exceed ${MAX_LIMIT}`,
      400
    );
  }
  return sql;
};