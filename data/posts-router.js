const express = require('express');

const Posts = require('./db');

const router = express.Router();

// middleware

// route handlers - handles what comes after /api/posts
// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The posts information could not be retrieved.' })
    })
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    const { id } = req.params;

    Posts.findById(id)
    .then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The post information could not be retrieved.' })
    })
});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    Posts.findCommentById(req.params.id)
    .then(messages => {
        if(messages) {
            res.status(200).json(messages)
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The comments information could not be retrieved.' })
    })
})

// POST	/api/posts	Creates a post using the information sent inside the request body.
// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.

module.exports = router;