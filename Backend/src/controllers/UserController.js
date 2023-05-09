const { User, Post, Reaction, Tag, Comment, Visited, UserPostReaction } = require('../database/initDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
let session = require('express-session');
require('dotenv').config();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 78300
    });
}

module.exports = {
    async sessionRender(req, res) {
        if (req.session.userid) {
            res.status(200).send({
                status: 1,
                message: 'You already have a session.',
                activeUser: req.session.userid
            });
        } else {
            res.status(200).send({
                status: 0,
                message: 'You need to login or create an account.'
            });
        }
    },
    async sessionCreate(req, res) {
        if (req.body.username == myusername && req.body.password == mypassword) {
            session = req.session;
            session.userid = req.body.username;
            console.log(req.session)
            res.send(`Hello, <a href=\'/logout'>Click to logout</a>`)
        } else {
            res.send('Invalid username or password.');
        }
    },
    


    // Authentication for user login in
    // Checks user credentials (if user exist and if correct password)
    // Returns user_id and JSON web token
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.unscoped().findOne({ where: { email } });
            if (!user) {
                return res.status(400).send({
                    status: 0,
                    message: 'Email or password incorrect.'
                });
            }
            if (!bcrypt.compareSync(password, user.password)){
                return res.status(400).send({
                    status: 0,
                    message: 'Email or password incorrect.'
                });
            }
    
            const user_id = user.id;
            await User.update({
                islogged: true
            }, {
                where: {
                    id: user_id
                }
            });
            req.session.userid = user_id;
            req.session.username = user.name;

            // To avoid showing the password in the response
            user.password = undefined

            const token = generateToken({ id: user.id });
            return res.status(200).send({
                status: 1,
                message: 'User logged in successfully.',
                // user_id: user.id,
                // token: token,
                sessionUserId: req.session.userid
            });            

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Creates and saves a new user to the database
    async store(req, res) {
        const { name, password, email } = req.body;
        try {
            const user = await User.create({ name, password, email, islogged: true });
            const token = generateToken({ id: user.id });

            req.session.userid = user.id;
            req.session.username = user.name;

            return res.status(200).send({
                status: 1,
                message: 'User registered sucessfully.',
                user_id: user.id,
                sessionUserId: req.session.userid
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Log out active user and destroy the session
    async logout(req, res) {
        try {
            // const user_id = req.session.userid;
            // await User.update({ islogged: false }, { where: { id: user_id } });
            req.session.destroy(
                err => {
                    if (err) {
                        return res.status(400).json({ error: err });
                    }
                    res.clearCookie(process.env.SESS_NAME)
                    return res.status(200).send({
                        status: 1,
                        message: 'Session closed sucessfully.',
                    })
                }
            );

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Searching for one user and all related activities
    async indexUserInfo(req, res) {
        const { user_id } = req.params;
        try {
            const user = await User.findByPk(user_id, {
                include: [
                    { association: 'post', attributes: ['id']},
                    { model: Visited, attributes: ['id']},
                    { model: Comment, attributes: ['id']},
                    { model: UserPostReaction, attributes: ['id']}
                ]
            });

            return res.status(200).send({
                user
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Searching for all records in the database
    async index(req, res) {
        try {
            const users = await User.findAll();
            if (users == null) {
            // if (users == ** || users == null) {
                return res.status(200).send({ message: 'No user registered.' });
            }
            return res.status(200).send({ users });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Updating one record in the database
    async update(req, res) {
        const { name, password, email } = req.body;
        const { user_id } = req.params;

        try {
            await User.update({
                name, password, email
            }, {
                where: {
                    id: user_id
                }
            });
            return res.status(200).send({
                status: 1,
                message: 'User updated sucessfully.'
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    },

    // Deleting one record in the database
    async delete(req, res) {
        const { user_id } = req.params;

        try {
            await User.destroy({
                where: {
                    id: user_id
                }
            });
            return res.status(200).send({
                status: 1,
                message: 'User deleted sucessfully.'
            });
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}