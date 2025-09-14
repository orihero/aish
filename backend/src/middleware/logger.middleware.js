import { Logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
    // Store original send
    const originalSend = res.send;

    // Get request time
    const startTime = Date.now();

    // Log request with enhanced formatting
    Logger.request(
        req.method, 
        req.originalUrl, 
        req.headers, 
        req.body
    );

    // Override send
    res.send = function (body) {
        // Log response
        const duration = Date.now() - startTime;
        
        // Parse response body for logging
        let responseData = null;
        try {
            responseData = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (e) {
            responseData = body;
        }

        Logger.response(
            res.statusCode, 
            responseData, 
            duration
        );

        // Restore original send
        res.send = originalSend;
        return originalSend.call(this, body);
    };

    next();
};
