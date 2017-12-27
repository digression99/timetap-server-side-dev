const mongoose = require('mongoose');
const {config} = require('../config/config');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);

module.exports = {mongoose};