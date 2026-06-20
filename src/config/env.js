import dotenv from 'dotenv';
dotenv.config();
import AppError from '../utils/AppError.js';
const requiredEnvVars = [
    "PORT",
    "DATABASE_URL",
    "NODE_ENV",
    "GEMINI_API_KEY"
];

requiredEnvVars.forEach((envVar) => {
    if(!process.env[envVar]){
        throw new AppError (
            `missing required env var ${envVar}`,
            500
        )
    }
})

const config = {
    PORT : process.env.PORT,
    DATABASE_URL : process.env.DATABASE_URL,
    NODE_ENV : process.env.NODE_ENV,
    GEMINI_API_KEY : process.env.GEMINI_API_KEY
}

export default config;