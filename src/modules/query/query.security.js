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

// Table-specific column blacklists
const BLACKLISTED_COLUMNS = {
  customers: ['phone'],
  products: [],
  orders: [],
  order_items: [],
};

const MAX_LIMIT = 100;


const extractTables = (sql) => {
  const matches = [
    ...sql.matchAll(/\b(?:FROM|JOIN)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
  ];
  return matches.map(match => match[1].toLowerCase());
};


export const validateGeneratedSQL = (sql) => {
  const normalizedSql = sql.trim().toUpperCase();


  if (!normalizedSql.startsWith("SELECT")) {
    throw new AppError("Only SELECT queries are allowed", 400);
  }

  for (const keyword of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i");
    if (regex.test(sql)) {
      throw new AppError(`Forbidden SQL operation detected: ${keyword}`, 400);
    }
  }

  const statements = sql.split(";").filter((stmt) => stmt.trim());
  if (statements.length > 1) {
    throw new AppError("Multiple SQL statements are not allowed", 400);
  }

  return true;
};


export const validateAllowedTables = (sql) => {
  const tables = extractTables(sql);

  for (const table of tables) {
    if (!ALLOWED_TABLES.includes(table)) {
      throw new AppError(`Access to table '${table}' is not allowed`, 400);
    }
  }

  return true;
};


export const validateAllowedColumns = (sql) => {
  const normalizedSql = sql.toLowerCase();
  
  if (normalizedSql.includes("*")) {
    throw new AppError(
      "Explicit column selection is required. Wildcard SELECT '*' is forbidden for security compliance.",
      400
    );
  }

  const tables = extractTables(sql);

  for (const table of tables) {
    const forbiddenColumns = BLACKLISTED_COLUMNS[table] || [];
    
    for (const column of forbiddenColumns) {
      const columnRegex = new RegExp(`\\b${column}\\b`, "i");
      
      if (columnRegex.test(normalizedSql)) {
        throw new AppError(
          `Access to forbidden column '${column}' on table '${table}' is strictly prohibited`,
          400
        );
      }
    }
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
    throw new AppError(`LIMIT cannot exceed ${MAX_LIMIT}`, 400);
  }
  return sql;
};