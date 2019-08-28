const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Chat = require('../../models/Chat');
const Inbox = require('../../models/Inbox');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  POST api/inbox
// @desc   Create inbox for user
// @access Private
router.post('/', auth, async (req, res) => {
	try {
		let inbox = new Inbox({user: req.user.id});
		await inbox.save();
		res.json(inbox);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;