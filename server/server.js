// modules.
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const path = require('path');
const cors = require('cors');

// configuration.
const config = require('./config/config');
const {mongoose} = require('./db/mongoose');

// app setting.
const app = express();
// @Patrick
// We need to specify the white-list in production.
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(__dirname + '/public'));

// routers.
app.use('/user', require('./routes/user/user')(express.Router()));
app.use('/todo', require('./routes/todo/todo')(express.Router()));

app.get('/', (req, res) => {
    res.send('index.');
});

app.get('*', (req, res) => {
    res.send('global.');
});

app.listen(config.PORT, () => {
    console.log("port : ", config.PORT);
});

module.exports = {app}; // for tests.