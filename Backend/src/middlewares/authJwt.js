const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).send({ error: 'No token provided.' });
        }

        // jwt format: Bearer fdssdzgjl
        const parts = authHeader.split(' ');
        if (!parts.length == 2) {
            return res.status(401).send({ error: 'Token error.' });
        }

        const [scheme, token] = parts;
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).send({ error: 'Malformatted token.' });
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) return res.status(401).send({ error: 'Invalid token.' });

            // req.userId = decoded.id;
            // console.log(decoded.id)
            req.auth = { userId: decoded.id };
            if (req.body.userId && req.body.userId !== decoded.id) {
                return res.status(401).send({ error: 'Invalid user ID' });
            } else {
                return next();
            }
            
        });

    } catch {
        next({'message': 'Invalid request!'});
    }
};