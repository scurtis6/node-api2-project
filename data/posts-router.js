const express = require('express');

const Posts = require('./db');

const router = express.Router();
// find(): GET /
// findById(): GET /:id
// insert(): POST /
// update(): PUT /:id
// remove(): DELETE /:id
// findCommentById(): GET /:id/comments
// findPostComments(): 
// insertComment(): POST /:id/comments

// middleware

// route handlers - handles what comes after /api/posts
// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    Posts.find()
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The posts information could not be retrieved.' })
    })
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
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
});

// POST	/api/posts	Creates a post using the information sent inside the request body.
// fractor the post this way
router.post('/', (req, res) => {
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(400).json({ error: 'Please provide title and contents for the post.' })
    } else {
        Posts.insert({title, contents})
        .then(post => {
            res.status(201).json(post)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: 'There was an error while saving the post to the database.' })
        })
    }
}); 

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    const{ id } = req.params;

    if (!req.body.text) {
      res.status(400).json({errorMessage: "Please provide text for the comment."})
    } else {
      Posts.insertComment({post_id: id, ...req.body})
      .then(comment => {
          if(comment === 0) {
              res.status(404).json({errorMessage: "could not find specified post"})
          } else {
              res.status(201).json({id: comment.id, post_id: id, ...req.body})
          }
      })
      .catch( err => {
          console.log(err)
          res.status(500).json({errorMessage: "could not add the comment"})
      })
    }
  })

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
    const { id } = req.params
    Posts.remove(id)
    .then(removed => {
        if (id) {
            res.status(200).json(removed)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The post could not be removed.' })
    })
})

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body
    if (!title || !contents) {
        res.status(404).json({ errorMessage: 'Please Provide title and contents for the post.' })
    }
    Posts.update(id, {title, contents})
    .then(updated => {
        if (updated) {
            Posts.findById(id)
            .then(post => {
                res.status(200).json(post)
            })
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: 'The post information could not be motified.' })
    })
})

module.exports = router;