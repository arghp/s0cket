const jwt = require('jsonwebtoken');
const config = require('config');


// A middleware function is a function that has access
// to req and res objects. next is a callback that is
// to be called to move to the next piece of middleware.

module.exports = (req, res, next) => {
	// get token from header
	const token = req.header('x-auth-token');

	// check if not token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' })		
	}

	// verify token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;
		next();
	} catch (err) {
		return res.status(401).json({msg: 'Token is not valid'});
	}
};