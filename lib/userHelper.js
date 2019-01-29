'use strict';

const userHelper = {
  requireCurrentUser: (req, res, next) => {
    const { id } = req.params;
    if (res.locals.userId !== parseInt(id, 10))
      return res.status(404).json({ error: 'Forbidden request' });
    next();
  },
};

module.exports = userHelper;
