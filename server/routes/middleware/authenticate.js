const {User} = require('../../models/user');

let authenticate = async (req, res, next) => {
    let token = req.header('x-auth');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(401).send("unauthorized.");
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        return res.status(401).send(e);
    }
};

module.exports = {authenticate};