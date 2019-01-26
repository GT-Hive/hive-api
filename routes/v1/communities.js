const db = require('../../models');
const Community = db['Community'];
const attributes = ['id'];
const interestAttributes = ['id', 'name'];
const association = {
	include: [{ association: 'Interest', attributes: interestAttributes }]
};

exports.getCommunities = (req, res) => {
	Community.findAll({  attributes, include: association.include } )
		.then((communities) => res.json({ communities }));
};

exports.getCommunity = (req, res) => {
	const { id } = req.params;

	Community.findOne({ where: { id }, attributes, include: association.include })
		.then(community => res.json({ community }));
};

exports.addCommunityByInterest = (req, res) => {
	const { community: { interest_id } }= req.body;
	
	db['Interest'].findOne({ where: { id: interest_id } })
		.then((interest) => {
			if (!interest) return res.status(404).json({ error: 'Interest not found for community' });
			Community.create({ interest_id })
				.then(() => res.json({ success: 'Successfully added the community' }))
				.catch((err) => res.json({ error: 'The community already exists' }));
		})
		.catch((err) => res.status(404).json({ error: 'Interest not found for community' }));
};

exports.removeCommunity = (req, res) => {
	const { id } = req.params;
	
	Community.destroy({ where: { id } })
		.then((removedCommunity) => {
			if (!removedCommunity) return res.status(404).json({ error: 'Community is not found' });
			res.json({ success: 'Successfully removed the community' })
		})
		.catch(err => res.json({ error: 'Failed to remove the community due to an error' }));
};

exports.removeCommunityByInterest = (req, res) => {
	const { id } = req.params;
	
	Community.destroy({ where: { interest_id: id } })
		.then((removedCommunity) => {
			if (!removedCommunity) return res.status(404).json({ error: 'Community is not found' });
			res.json({ success: 'Successfully removed the community' })
		})
		.catch(err => res.json({ error: 'Failed to remove the community due to an error' }));
};
