import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
    "PORT",
    "MONGO_URI",
    "NODE_ENV"
];

requiredEnvVars.forEach((envVar) => {
    if(!process.env[envVar]){
        throw new Error (
            `missing required env var ${envVar}`
        )
    }
})

const config = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    NODE_ENV : process.env.NODE_ENV
}

export default config;