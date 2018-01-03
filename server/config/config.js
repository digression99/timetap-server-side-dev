const env = process.env.NODE_ENV || 'development';

let config = {
    PORT : 0,
    MONGODB_URI : "",
    JWT_SECRET : ""
};

const envConfig = require('./config.json')[env];
Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);

if (env === 'production') {
    config.PORT = process.env.PORT || config.PORT;
}

if (require.main == module) {
    console.log(config);
} else {
    module.exports = {config};
}