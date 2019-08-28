const mongoose = require('mongoose');

const InboxSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	},
	conversations: [
		{
			recipient: {
				type: mongoose.mongoose.Schema.Types.ObjectId,
				ref: 'users'
			},
			chat: {
				type: mongoose.mongoose.Schema.Types.ObjectId,
				ref: 'chat'
			},
			read: {
				type: Boolean,
				default: false
			}
		}
	]
});

module.exports = Inbox = mongoose.model('inbox', InboxSchema);