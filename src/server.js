import app from './app.js'
import config from './config/env.js'
import prisma from './config/prisma.js';
import logger from './utils/logger.js'
let server ;
const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info(`Postgress connected`);
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
        await prisma.$disconnect();
        logger.info("postgres connection closed");
        process.exit(0);
})

process.on("SIGTERM", async () => {
    logger.info('SIGTERM received, Shutting down...');
        await prisma.$disconnect();
        logger.info("postgres connection closed");
        process.exit(0);
})
