const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route  POST api/posts
// @desc   Create Post
// @access Private
router.post('/', [ auth, 
  check('text', 'Text is required').not().isEmpty()
], 
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }


  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post ({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
});



// @route  GET api/posts
// @desc   GET ALL Posts
// @access Private

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}});

// @route  GET api/posts/:id
// @desc   GET Post by id
// @access Private

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post Not Found'
      });
    }
    res.status(500).send('Server Error');
  }
});

// @route  DELETE api/posts/:id
// @desc   DELETE A POST
// @access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        msg: 'Post Not Found'
      });
    }

    // Check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({msg: 'User Not Authorized'});
    }

    await post.remove();

    res.json({ msg: 'Post removed'});
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: 'Post Not Found'
      });
    }
    res.status(500).send('Server Error');
}});

module.exports = router;