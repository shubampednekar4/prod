import express from "express";
import { register } from "./auth.controller.js";
import { registerSchema } from "./auth.validation.js";
import validate from "../../middleware/validate.js";

const router = express.Router();

router.post(
    "/register",
    validate(registerSchema),
    register
);

export default router;