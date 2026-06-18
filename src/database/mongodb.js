import mongoose from "mongoose";
import config from "../config/env.js";
import logger from "../utils/logger.js";
const connectdb = async () => {
    try {
        const connection = await mongoose.connect(config.MONGO_URI)
        logger.info(`Mongodb connected ${connection.connection.host}`)
    } catch (error) {
        logger.error(
            "Mongodb connection failed :", error.message
        )
        throw error;
    }
}

export default connectdb;