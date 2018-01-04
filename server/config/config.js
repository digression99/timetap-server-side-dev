const env = process.env.NODE_ENV || 'development';

const config = {
    PORT : 0,
    MONGODB_URI : "",
    JWT_SECRET : ""
};

const envConfig = require('./config.json')[env];
Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);

config.PORT = process.env.PORT;
config.MONGODB_URI = process.env.MONGODB_URI;
config.JWT_SECRET = process.env.JWT_SECRET;

module.exports = config;
