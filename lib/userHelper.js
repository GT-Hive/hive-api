'use strict';

const userHelper = {
  requireCurrentUser: (req, res, next) => {
    const { id } = req.params;
    if (res.locals.userId !== parseInt(id, 10)) {
      return res.status(404).json({ error: 'Forbidden request' });
    }
    next();
  },
  attributes: [
    'id',
    'email',
    'first_name',
    'last_name',
    'intro',
    'profile_img',
  ],
};

module.exports = userHelper;
