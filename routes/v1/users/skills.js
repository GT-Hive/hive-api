'use strict';

const db = require('../../../models');
const skillParams = ['id', 'name'];

exports.getUserSkills = (req, res) => {
	const { id } = req.params;

	db.Skill
		.findAll({
			attributes: skillParams,
			include: [{
				association: 'User',
				where: { id },
				attributes: []
			}],
		})
		.then(skills => {
			skills
				? res.json({ skills })
				: res.status(404).json({ error: 'Skill is not found' });
		})
		.catch(err => res.status(403).json({ error: 'Cannot get user skills' }));
};

exports.addUserSkill = (req, res) => {
	const { skill_id } = req.params;
	const { user } = res.locals;

	db.Skill
		.findOne({ where: { id: skill_id } })
		.then(skill => {
			if (!skill) return res.status(404).json({ error: 'Skill is not found' });

			user
				.addSkill(skill)
				.then(() => res.json({ success: 'Successfully added the skill' }))
				.catch(err => res.status(403).json({ error: 'Cannot add the skill' }));
		})
		.catch(err => res.status(404).json({ error: 'Skill is not found' }));
};

exports.removeUserSkill = (req, res) => {
	const { id, skill_id } = req.params;

	db.User_Skill
		.destroy({ where: { user_id: id, skill_id } })
		.then(removedSkill => {
			removedSkill
				? res.json({ success: 'Successfully removed the skill from the user' })
				: res.status(404).json({ error: 'Skill is not found from the user' });
		})
		.catch(err => res.json({ error: 'Failed to remove the skill from the user' }));
};
