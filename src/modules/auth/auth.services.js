import User from "./auth.model.js";
import AppError from "../../utils/AppError.js";

export const registerUser = async (data) => {
    const existingUser = await User.findOne({
        email : data.email,
    })

    if(existingUser) {
        throw new AppError(
            "Email already exisits",
            400
        )
    }
    const user = await User.create(data);
    return user;
}