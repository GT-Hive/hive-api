const userHelper = {
	requireCurrentUser: (req, res, next) => {
		const { id } = req.params;
		if (res.locals.userId !== parseInt(id)) return res.status(404).json({ error: 'Forbidden request' });
		next();
	},
};

module.exports = userHelper;
