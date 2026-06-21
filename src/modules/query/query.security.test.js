import test from "node:test";
import assert from "node:assert/strict";

import {
  validateGeneratedSQL,
  validateAllowedTables,
  validateAllowedColumns,
  enforceLimit,
} from "./query.security.js";

test(
  "should add LIMIT 100 when no limit exists",
  () => {
    // Note: If you enforce explicit column selection, change this to an allowed format like "SELECT id FROM products"
    const result = enforceLimit(
      "SELECT * FROM products"
    );

    assert.equal(
      result,
      "SELECT * FROM products LIMIT 100"
    );
  }
);

test(
  "should reject DELETE statements",
  () => {
    assert.throws(() =>
      validateGeneratedSQL(
        "DELETE FROM products"
      )
    );
  }
);

test(
  "should reject UPDATE statements",
  () => {
    assert.throws(() =>
      validateGeneratedSQL(
        "UPDATE products SET name='abc'"
      )
    );
  }
);

test(
  "should reject unauthorized tables",
  () => {
    assert.throws(() =>
      validateAllowedTables(
        "SELECT * FROM users"
      )
    );
  }
);

test(
  "should accept visible non-sensitive column names",
  () => {
    const result = validateAllowedColumns(
      "SELECT id, name, email FROM customers"
    );
    assert.equal(result, true);
  }
);

test(
  "should reject blacklisted columns like phone",
  () => {
    assert.throws(() =>
      validateAllowedColumns(
        "SELECT phone FROM customers"
      )
    );
  }
);

test(
  "should reject wildcard SELECT * statements",
  () => {
    assert.throws(() =>
      validateAllowedColumns(
        "SELECT * FROM customers"
      )
    );
  }
);