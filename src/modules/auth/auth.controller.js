import { registerUser } from "./auth.services.js"
import catchAsync from "../../utils/catchAsync.js"
import { sendSuccess } from "../../utils/apiResponse.js"

export const register = catchAsync(
    async ( req, res) => {
        const user = await registerUser(
            req.body
        );

        sendSuccess(
            res,
            201,
            "User registered",
            user
        )
    }
)