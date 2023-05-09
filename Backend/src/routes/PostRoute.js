// All the Post routes configuration
const express = require('express');
const router = express.Router();

// const authMiddleware = require('../middlewares/authJwt');
const authMiddleware = require('../middlewares/authSession');
const multer = require('../middlewares/multerConfig');

const PostController = require('../controllers/PostController');
const ReactionController = require('../controllers/ReactionController');

// All the routes are intercepted by the middleware of auht
router.use(authMiddleware);


router.get('/:post_id?', PostController.getPost); // Find all posts | find one post
router.post('/', multer, PostController.createPost); // Create new post
router.put('/:id', multer, PostController.updatePost); // Update one post
router.delete('/:id', PostController.deletePost); // Delete one post

router.get('/read/:post_id', PostController.findReadPost); // Find read posts
router.post('/read/:post_id', PostController.markReadPost); // Mark post as read

// router.get('/:tag/tag', PostController.indexTag); // Find posts by tag
// router.get('/:user_id/user', PostController.indexUser); // Get posts of one user
// router.get('/:user_id/user', PostController.indexOneUser); // Get posts of one user
// router.post('/tags', PostController.storeTagCheck); // Create new post with tag check
// router.put('/like/:id', PostController.likePost); // Update increment likes


router.get('/reactions/:post_id', ReactionController.getReactions);
router.post('/reactions/:post_id', ReactionController.createReaction);
router.delete('/reactions/:post_id', ReactionController.deleteReaction);

router.get('/comments/:post_id', ReactionController.getComments);
router.post('/comments/:post_id', ReactionController.createComment);
router.put('/comments/:com_id', ReactionController.updateComment);
router.delete('/comments/:com_id', ReactionController.deleteComment);

module.exports = router;