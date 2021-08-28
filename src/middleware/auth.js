const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ "error": "Please authenticate " });
    }
}


//Middleware will get executed between the request and the mapping of the route
//has access to  the same info as the  route handler
//it can be used in index.js for every route using app.use()
//or on specific routes (eg: user.js ->  GET USERS) as the  2nd param to router
module.exports = auth;
