const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Message = require('../../models/Message');
const User = require('../../models/User');

// @route  GET api/inbox/:id
// @desc   get messages with user of id
// @access Private
router.get('/:id', auth, async (req, res) => {
	try {
		// make sure that the recipient exists
		const recipient = await User.findById(req.params.id).select('-password');
		if (!recipient) {
			return res.status(404).json({ msg: 'Recipient not found'});
		}

		// find the chat with the given user and recipient
		const chat = await Message.find({ $or: [{ sender: req.user.id, recipient: req.params.id }, 
			{ sender: req.params.id, recipient: req.user.id }]});

		// if the chat exists
		if (!chat) {
			return res.status(404).json({ msg: 'Messages not found'});
		}

		res.json(chat);

	} catch (err) {
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Recipient not found'});
		}
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route  POST api/inbox/:id
// @desc   Send a new message
// @access Private
router.post('/:id', 
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
			const sender = await User.findById(req.user.id).select('-password');
			// make sure that the recipient exists
			const recipient = await User.findById(req.params.id).select('-password');
			if (!recipient) {
				return res.status(404).json({ msg: 'Recipient not found'});
			}

			// create and save new chat
			const newMessage = new Chat({
				sender,
				recipient,
				text: req.body.text
			});

			await newMessage.save();
			res.json(newMessage);

		} catch (err) {
			if (err.kind === 'ObjectId') {
				return res.status(404).json({ msg: 'Recipient not found'});
			}
			console.error(err.message);
			res.status(500).send('Server error');
		}
	}
);


module.exports = router;