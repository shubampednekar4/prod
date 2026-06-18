import winston, { error, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const logger = winston.createLogger({
    level : 'info',
    format : winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({stack : true}),
        winston.format.json()
    ),
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({
            filename : 'logs/test.log',
            level : 'error'
        }),
        new winston.transports.File({
            filename : 'logs/combined.log'
        }),
        new DailyRotateFile({
            filename : 'logs/test%DATE%.log',
            datePattern : 'YYYY-MM-DD',
            maxSize : '20m',
            maxFiles : '14d'
        })
    ]
})

export default logger;