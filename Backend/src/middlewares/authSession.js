// let session = require('express-session');

module.exports = (req, res, next) => {
    try {
        if (req.session.userid) {
            return next();
        } else {
            return res.status(401).send({
                message: 'Problem with your session.',
                data: req.session
            })
        }
    } catch (err) {
        return res.status(400).json({ error: err });
    }
};
