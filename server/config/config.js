const env = process.env.NODE_ENV || 'development';

let config = {
    PORT : 0,
    MONGODB_URI : "",
    JWT_SECRET : ""
};

if (env === 'development' || env === 'test') {
    const envConfig = require('./config.json')[env];
    Object.keys(envConfig).forEach(key => config[key] = envConfig[key]);
}

if (require.main == module) {
    console.log(config);
} else {
    module.exports = {config};
}