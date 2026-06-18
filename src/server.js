import mongoose from 'mongoose';
import app from './app.js'
import config from './config/env.js'
import connectdb from './database/mongodb.js' 
import logger from './utils/logger.js'
let server ;
const startServer = async () => {
    try {
        await connectdb();
        server = app.listen(config.PORT, () => {
            logger.info(`server running on port ${config.PORT}`)
        })
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

startServer();

process.on("SIGINT", async () => {
    logger.info("SIGINT received. Shutting down...");
    server.close(async () => {
        await mongoose.connection.close();
        logger.info("Mongodb connection closed");
        process.exit(0);
    })
})

process.on("SIGTERM", async () => {
    logger.info('SIGTERM received, Shutting down...');
    server.close(async () => {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed");
        process.exit(0);
    })
})
