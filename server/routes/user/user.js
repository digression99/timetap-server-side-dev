const {authenticate} = require('../middleware/authenticate');
const {User} = require('../../models/user');
const _ = require('lodash');

module.exports = (router) => {

    router.get('/profile', authenticate, (req, res) => {
        res.send(req.user);
    });

    // save email and password.
    router.post('/', async (req, res) => {
        try {
            const user = new User(_.pick(req.body, ['email', 'password']));
            // need to check valid email.
            await user.save();
            const token = await user.generateAuthToken();
            return res.header('x-auth', token).send(user);
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    router.post('/login', async (req, res) => {
        try {
            const body = _.pick(req.body, ['email', 'password']);
            const user = await User.findByCredentials(body.email, body.password);
            const token = await user.generateAuthToken();
            return res.header('x-auth', token).send(user);
        } catch (e) {
            return res.status(400).send();
        }
    });

    router.delete('/logout', authenticate, async (req, res) => {
        try {
            await req.user.removeToken(req.token);
            return res.status(200).send();
        } catch (e) {
            return res.status(400).send(e);
        }
    });

    return router;
};

