import test from "node:test";
import assert from "node:assert/strict";

import {
  validateGeneratedSQL,
  validateAllowedTables,
  enforceLimit,
} from "./query.security.js";

test(
  "should add LIMIT 100 when no limit exists",
  () => {
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