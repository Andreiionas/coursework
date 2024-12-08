const express = require('express');
const { createPost, getPost, likePost, dislikePost, commentOnPost, getMostEngagedPost } = require('../controllers/postsController');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// Routes for posts
router.post('/', authenticate, createPost);
router.get('/', authenticate, getPost);
router.post('/:postId/like', authenticate, likePost);
router.post('/:postId/dislike', authenticate, dislikePost);
router.post('/:postId/comment', authenticate, commentOnPost);
router.get('/most-engaged/:topic', authenticate, getMostEngagedPost);

module.exports = router;
