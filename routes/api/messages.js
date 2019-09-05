const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Message = require('../../models/Message');
const User = require('../../models/User');

// @route  GET api/messages
// @desc   Get messages
// @access Private
router.get('/', auth, async (req, res) => {
	try {
		// find the chat with the given user and recipient
		const chat = await Message.find({ $or: [{ 'sender.user': req.user.id }, { 'recipient.user': req.user.id }]})
			.sort({ created_at: -1 });

		if (req.query.view === 'inbox') {
			// for the inbox view, we will show the latest single message for each conversation
			// for this purpose, we will use a map
			let inboxMap = new Map();

			// loop through message objects
			// because our query was sorted by created_at
			// only the most recent message for any given conversation will be stored
			for (const msg of chat) {
				let current = msg.sender.user.toString();
				if (current === req.user.id) {
					current = msg.recipient.user.toString();
				}
				// store the message object in the map
				if (!inboxMap.has(current)){
					inboxMap.set(current, msg);
				}
			}

			let inboxArray = [];
			for (var value of inboxMap.values()) {
				inboxArray.push(value);
			}

			return res.json(inboxArray);
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

// @route  GET api/messages/user/:id
// @desc   get messages with user of id
// @access Private
router.get('/user/:id', auth, async (req, res) => {
	try {
		// make sure that the recipient exists
		const recipient = await User.findById(req.params.id).select('-password');
		if (!recipient) {
			return res.status(404).json({ msg: 'Recipient not found'});
		}

		// find the chat with the given user and recipient
		const chat = await Message.find({ $or: [{ 'sender.user': req.user.id, 'recipient.user': req.params.id }, 
			{ 'sender.user': req.params.id , 'recipient.user': req.user.id }]})
			.sort({ created_at: -1 })
			.limit(20);

		if (chat.length !== 0) {

			// if the sender of the latest message is the other party
			// mark it as read as the chat has now been accessed

			// (TODO?) this means that if a sender sends consecutive messages
			// only the latest one will be marked as read for the recipient
			let latestMessage = chat[0];

			if (latestMessage.sender.user.toString() === req.params.id) {
				latestMessage.read = true;
			}

			await latestMessage.save();
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

// @route  POST api/messages/user/:id
// @desc   Send a new message
// @access Private
router.post('/user/:id', 
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

			const newSender = {
				user: sender._id,
				name: sender.name,
				avatar: sender.avatar
			}

			const newRecipient = {
				user: recipient._id,
				name: recipient.name,
				avatar: recipient.avatar
			}
			// create and save new chat
			const newMessage = new Message({
				sender: newSender,
				recipient: newRecipient,
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