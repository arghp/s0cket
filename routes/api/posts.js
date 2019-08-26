const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post('/', 
	[
		auth,
		[
		check('text', 'Text is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');

			const newPost = new Post({
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar
			});

			const post = await newPost.save();

			res.json(post);

		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}

		

	}
);

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1});
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.status(500).send('Server error');
	}
});

// @route  DELETE api/posts/:id
// @desc   Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found'});
		}

		// check user
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized'});
		}
		
 		await post.remove();

		res.json({ msg: 'Post removed' });
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.status(500).send('Server error');
	}
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found'});
		}

		// check if the post has already been liked
		if (post.likes
			.filter(like => like.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({ msg: 'Post already liked'});
		}
		
 		post.likes.unshift({ user: req.user.id });

 		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.status(500).send('Server error');
	}
});


// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found'});
		}

		// check if the post has already been liked
		const newLikes = post.likes.filter(like => like.user.toString() !== req.user.id);

		if (post.likes.length === newLikes.length) {
			return res.status(400).json({ msg: 'Post has not yet been liked'});
		}
		
		// update likes
 		post.likes = newLikes;

 		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.status(500).send('Server error');
	}
});

// @route  PUT api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.put('/comment/:id', 
	[
		auth,
		[
		check('text', 'Text is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findById(req.user.id).select('-password');
			const post = await Post.findById(req.params.id);

			const newComment = {
				user: req.user.id,
				text: req.body.text,
				name: user.name,
				avatar: user.avatar
			};

			post.comments.unshift(newComment);

			await post.save();

			res.json(post.comments);

		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}

		

	}
);

// @route  PUT api/posts/comment/:id/:comment_id
// @desc   Remove a comment
// @access Private
router.put('/comment/:id/:comment_id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found'});
		}

		// find comment
		const comment = post.comments.find(
			comment => comment.id === req.params.comment_id
		);

		if (!comment) {
			return res.status(404).json({ msg: 'Comment not found'});
		}

		// check usr
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'User not authorized'});
		}

		// filter comments
		const newComments = post.comments.filter(comment => comment.id !== req.params.comment_id);
		
		// update comments
 		post.comments = newComments;

 		await post.save();

		res.json(post.comments);
	} catch (err) {
		console.error(err.message);

		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found'});
		}

		res.status(500).send('Server error');
	}
});
module.exports = router;

// @route  PUT api/posts/:id
// @desc   Edit a post
// @access Private
router.put('/:id', 
	[
		auth,
		[
		check('text', 'Text is required').not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const post = await Post.findById(req.params.id);

			if (!post) {
				return res.status(404).json({ msg: 'Post not found'});
			}

			// check that the post belongs to the user
			if (post.user.toString() !== req.user.id) {
				return res.status(401).json({ msg: 'User not authorized'});
			}


			post.text = req.body.text;
			post.edited = true;

			await post.save();

			res.json(post);

		} catch (err) {
			console.error(err.message);

			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Post not found'});
			}
			res.status(500).send('Server error');
		}

		

	}
);