const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const {config} = require('../../config/config');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


const users = [{
    _id : userOneId,
    email : 'kim@kim.com',
    password : 'userOnePass',
    tokens : [
        {
            access : 'auth',
            token : jwt.sign({
                _id : userOneId,
                access : 'auth'
            }, config.JWT_SECRET).toString()
        }
    ]
},{
    _id : userTwoId,
    email : 'shim@shim.com',
    password : 'userTwoPass',
    tokens : [
        {
            access : 'auth',
            token : jwt.sign({
                _id : userTwoId,
                access : 'auth'
            }, config.JWT_SECRET).toString()
        }
    ]
}];

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();

            Promise.all([userOne, userTwo])
                .then(() => {
                    done();
                });
        });
};


const todos = [
    {
        _id : new ObjectID(),
        text : "first test todo",
        createdAt : 1,
        completed : false,
        completedAt : null,
        _user : userOneId,
    },
    {
        _id : new ObjectID(),
        text : "second test todo",
        createdAt : 2,
        completed : true,
        completedAt : 333,
        _user : userTwoId,
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};