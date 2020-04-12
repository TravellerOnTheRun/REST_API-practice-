const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

//GET /feed/posts
router.get('/posts', isAuth,  feedController.getPosts);

//POST /feed/post
router.post(
    '/post',
    isAuth, 
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min:5 })
    ], 
    feedController.createPost
);

router.get('/post/:postId', feedController.getSinglePost);

router.put(
    '/edit/:postId',
    isAuth,
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min:5 })
    ], feedController.updatePost
);

router.delete('/delete/:postId', isAuth, feedController.deletePost);

router.get('/status', isAuth, feedController.getStatus);

router.put('/status-update', isAuth, feedController.updateStatus);

module.exports = router;