const mongoose = require('mongoose');
const _ = require('lodash');

let TodoSchema = new mongoose.Schema({
    text : {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    completed : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Number,
        default : null
    },
    completedAt : {
        type : Number,
        default : null
    },
    _user : {
        type : mongoose.Schema.Types.ObjectId
    }
});

TodoSchema.methods.toJSON = function() {
    // need to check if completedAt is null.
    return _.pick(this.toObject(), ['_id', 'text', 'completed', 'createdAt', 'completedAt', '_user']);
};

let Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};