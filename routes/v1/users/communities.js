'use strict';

const db = require('../../../models');

exports.getUserCommunities = (req, res) => {
	const { id } = req.params;

	db.sequelize
		.query(`
      SELECT name
      FROM Interest
      WHERE id IN (
        SELECT interest_id 
        FROM Community
        JOIN User_Community AS UC
        ON Community.id = UC.community_id
        WHERE user_id = $id
      );
    `,
			{ bind: { id }, type: db.sequelize.QueryTypes.SELECT }
		)
		.then(communities => {
			communities
				? res.json({ communities })
				: res.status(404).json({ error: 'Community is not found' });
		})
		.catch(err => {
			console.log(err);
			res.status(403).json({ error: 'Cannot get user communities' })
		});
};

exports.addUserCommunity = (req, res) => {
	const { community_id } = req.params;
	const { user } = res.locals;

	db.Community
		.findOne({ where: { id: community_id } })
		.then(community => {
			if (!community) return res.status(404).json({ error: 'Community is not found' });

			user
				.addCommunity(community)
				.then(() => res.json({ success: 'Successfully added the community' }))
				.catch(err => res.status(403).json({ error: 'Cannot add the community' }));
		})
		.catch(err => res.status(404).json({ error: 'Community is not found' }));
};

exports.removeUserCommunity = (req, res) => {
	const { id, community_id } = req.params;

	db.User_Community
		.destroy({ where: { user_id: id, community_id } })
		.then(removedCommunity => {
			removedCommunity
				? res.json({ success: 'Successfully removed the community from the user' })
				: res.status(404).json({ error: 'Community is not found from the user' });
		})
		.catch(err => res.json({ error: 'Failed to remove the community from the user' }));
};
