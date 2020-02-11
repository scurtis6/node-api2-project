const express = require('express');

const postsRouter = require('../data/posts-router');

const router = express.Router();

// this router handles requests beginning in /api

// handle /api /posts
router.use('/posts', postsRouter)


module.exports = router;