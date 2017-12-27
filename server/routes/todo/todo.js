
const {authenticate} = require('../middleware/authenticate');
const {Todo} = require('../../models/todo');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const moment = require('moment');

module.exports = (router) => {

    router.get('/todos', authenticate, async (req, res) => {
        try {
            const todos = await Todo.find({
                _user : req.user._id
            });
            return res.send({todos});
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    router.get('/:id', authenticate, async (req, res) => {
        try {
            const id = req.params.id;
            if (!ObjectID.isValid(id)) {
                return res.status(404).send("ID not valid.");
            }

            const todo = await Todo.findOne({
                _id : id,
                _user : req.user._id
            });

            if (!todo) res.status(404).send("No todo found.");
            return res.status(200).send({todo});
        } catch (e) {
            return res.status(404).send(e);
        }
    });

    router.post('/', authenticate, async (req, res) => {
        try {
            let todo = new Todo({
                text : req.body.text,
                _user : req.user._id,
                createdAt : moment().valueOf()
            });
            await todo.save();
            res.send({todo});
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    // patch completed to true or false.
    // need to patch text or others.
    router.patch('/:id', authenticate, async (req, res) => {
        try {
            const id = req.params.id;
            let body = _.pick(req.body, ['text', 'completed']);

            if (!ObjectID.isValid(id)) {
                return res.status(404).send("ID is invalid.");
            }

            if (_.isBoolean(body.completed) && body.completed) {
                body.completed = true;
                body.completedAt = moment().valueOf();
            } else {
                body.completed = false;
                body.completedAt = null;
            }

            const todo = await Todo.findOneAndUpdate({
                _id : id,
                _user : req.user._id
                }, // query
                {
                    $set : body
                }, // update data.
                {
                    new : true
                });

            if (!todo) {
                return res.status(404).send("Todo doesn't exist");
            }
            res.send({todo});
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    router.delete('/:id', authenticate, async (req, res) => {
        try {
            const id = req.params.id;

            if (!ObjectID.isValid(id)) {
                return res.status(404).send("ID is not valid.");
            }

            const todo = await Todo.findOneAndRemove({
                _id : id,
                _user : req.user._id
            });
            if (!todo) {
                return res.status(404).send('No Todo found.');
            }
            res.status(200).send({todo});
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    return router;
};