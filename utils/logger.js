// app/utils/logger.js
const { createLogger, format, transports } = require('winston');

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Capture stack trace
    format.splat(), // Support string interpolation
    format.printf(info => {
        if (info instanceof Error) {
            // If the log is an error, include the stack trace
            return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}\n${info.stack}`;
        }
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
    })
);

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }), // All logs
        new transports.File({ filename: 'errors.log', level: 'error' }), // Only errors
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'exceptions.log' })
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'rejections.log' })
    ],
    exitOnError: false,
});

// Optional: Colorize logs in non-production environments
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.printf(info => {
                if (info instanceof Error) {
                    return `${info.timestamp} [${info.level}]: ${info.message}\n${info.stack}`;
                }
                return `${info.timestamp} [${info.level}]: ${info.message}`;
            })
        )
    }));
}

module.exports = logger;
