const env = process.env.NODE_ENV || 'development';

let config = {
    PORT : 0,
    MONGODB_URI : "",
    JWT_SECRET : ""
};

if (env === 'development' || env === 'test') {
    const envConfig = require('./config.json')[env];
    Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);
} else if (env === 'production') {
    const envConfig = require('./config.json')[env];
    Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);
    config.PORT = process.env.PORT || config.PORT;
    console.log(config);
}

if (require.main == module) {
    console.log(config);
} else {
    module.exports = {config};
}