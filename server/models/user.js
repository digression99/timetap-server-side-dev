const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

let UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        minlength : 1,
        trim : true,
        unique : true,
        validate : {
            isAsync : false,
            validator : validator.isEmail,
            message : '{value} is not a valid email.'
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 6
    },
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

UserSchema.methods.toJSON = function () {
    return _.pick(this.toObject(), ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = async function () {
    try {

        let user = this;
        const access = 'auth';
        const token = jwt.sign({
            _id : user._id.toHexString(),
            access
        }, config.JWT_SECRET)
            .toString();
        user.tokens.push({access, token});
        await user.save();
        return Promise.resolve(token);
    } catch (e) {
        console.log("error occured.");
        return Promise.reject(e);
    }
};

UserSchema.methods.removeToken = function (token) {
    return this.update({
        $pull : { // remove token from the document.
            tokens : {token}
        }
    });
};

UserSchema.statics.findByCredentials = async function (email, password) {
    try {
        const user = await this.findOne({
            email
        });
        if (!user) {
            return Promise.reject();
        }

        // result is true or false.
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            return Promise.resolve(user);
        } else {
            return Promise.reject();
        }
    } catch (e) {
        return Promise.reject(e);
    }
};

UserSchema.statics.findByToken = async function (token) {
    try {
        const User = this;

        const decoded = jwt.verify(token, config.JWT_SECRET);
        return User.findOne({
            '_id' : decoded._id,
            'tokens.token' : token,
            'tokens.access' : 'auth'
        });
    } catch (e) {
        return Promise.reject(e);
    }
};

UserSchema.pre('save', async function (next) {
    try {
        let user = this;

        if (user.isModified('password')) {
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

        }
        next();
    } catch (e) {
        console.log(e);
        next();
    }
});

let User = mongoose.model('User', UserSchema);
module.exports = {User};













