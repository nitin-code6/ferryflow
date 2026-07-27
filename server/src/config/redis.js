const { createClient } = require('redis');

const rawClient = createClient({
    username: 'default',
    password: process.env.REDIS_KEY,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

rawClient.on('error', err => console.log('Redis Client Error', err));

// Safe Proxy client that prevents crashing when Redis is down/disconnected
const safeClient = new Proxy(rawClient, {
    get(target, prop) {
        // If it is a function, intercept it
        if (typeof target[prop] === 'function') {
            return async (...args) => {
                // If it's the connect method, execute it
                if (prop === 'connect') {
                    return target[prop](...args);
                }
                // For other operations, check if the client is active
                if (!target.isOpen) {
                    console.warn(`Redis is offline. Skipping operation: ${String(prop)}`);
                    if (prop === 'exists') return false;
                    return null;
                }
                try {
                    return await target[prop](...args);
                } catch (err) {
                    console.error(`Redis operation ${String(prop)} failed:`, err);
                    if (prop === 'exists') return false;
                    return null;
                }
            };
        }
        return target[prop];
    }
});

module.exports = safeClient;
