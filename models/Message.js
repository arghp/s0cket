const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}
	message: {
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