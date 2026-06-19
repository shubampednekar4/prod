import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morganMiddleware from './middleware/morganMiddleware.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import rateLimiter from './middleware/rateLimiter.js';
import config from './config/env.js';

import customerRouter from './modules/customer/customer.routes.js';

const app = express();
app.use(morganMiddleware);
// app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(rateLimiter);
app.use(express.json({
    limit : "100kb"
}));

app.get("/health", (req,res) => {
    res.status(200).json({
        success : true,
        message : "Server is running",
        environment : config.NODE_ENV,
        uptime : process.uptime(),
        timestamp : new Date().toISOString(),
    })
})
app.get("/error",(req,res, next) => {
    next (
        new AppError(
            "Invalid page",
            404
        )
    )
})

app.use("/api/v1/customers",customerRouter);
app.use(errorHandler);

export default app;