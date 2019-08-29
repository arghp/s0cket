const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	sender: {
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		},
		name: {
			type: String
		},
		avatar: {
			type: String
		},
	},
	recipient: {
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users'
		},
		name: {
			type: String
		},
		avatar: {
			type: String
		},
	},
	text: {
		type: String,
		required: true
	},
	read: {
		type: Boolean,
		default: false
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = Message = mongoose.model('messages', MessageSchema);