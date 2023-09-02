const jwt = require('jsonwebtoken');
const UserSchema = require('../models/userModel')


const requireAuth = async (req, res, next) => {

    // Verify auth
    const { authorization } = req.headers // destructure 

    if (!authorization) {
        return res.status(401).json({error: 'Authorization token required.'});
    }

    // need to split incoming string for just the JWT (split by space)
    const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET);

        req.user = await UserSchema.findOne({ _id }).select('id');
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({error: 'Request is not authorized'});
    }
}

module.exports = requireAuth;