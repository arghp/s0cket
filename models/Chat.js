const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
	messages: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			text: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			date: {
				type: Date,
				default: Date.now
			}
		}
	],
	// implementing only 2 possible participants for the time being
	participants: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'user'
			},
			// if the participant has read the most recent message(s)
			read: {
				type: Boolean,
				default: false
			}
		}
	]
});

module.exports = Chat = mongoose.model('chat', ChatSchema);