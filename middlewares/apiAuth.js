function apiAuth(req, res, next) {
	const { auth } = req.query;

	if (process.env.API_AUTH === auth) {
		next();
	} else {
		res.status(401).send({
			message: 'you are Unauthorized  for this request',
		});
	}
}

module.exports = apiAuth;
