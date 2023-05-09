// All the User routes configuration

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authSession'); // Redirect to login if no active session

const UserController = require('../controllers/UserController');


router.get('/', UserController.sessionRender);
// router.post('/user', UserController.sessionCreate);


router.post('/login', UserController.login); // Authentication for user login in
router.post('/signup', UserController.store); // Create new user
router.post('/logout', UserController.logout); // Destroy session and logs out

router.get('/user/:user_id', authMiddleware, UserController.indexUserInfo); // Get info for logged user


// router.get('/users', authMiddleware, UserController.index); // Get all users
// router.put('/:user_id', UserController.update); // Update one user
// router.delete('/:user_id', UserController.delete); // Delete one user

module.exports = router;