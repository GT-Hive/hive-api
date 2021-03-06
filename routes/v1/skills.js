'use strict';

const Skill = require('../../models').Skill;
const skillParams = ['id', 'name'];
const userParams = require('../../lib/userHelper').attributes;

exports.getSkills = (req, res) => {
  Skill
    .findAll({
      attributes: skillParams,
    })
    .then(skills => res.json({ skills }));
};

exports.getSkill = (req, res) => {
  const { id } = req.params;

  Skill
    .findOne({
      where: { id },
      attributes: skillParams,
    })
    .then(skill => res.json({ skill }));
};

exports.createSkill = (req, res) => {
  const { skill } = req.body;

  Skill
    .create({
      name: skill.name,
    })
    .then(() => res.json({ success: 'Successfully created the skill' }))
    .catch(err => res.json({ error: 'Failed to create the skill due to an error' }));
};

exports.removeSkill = (req, res) => {
  const { id } = req.params;

  Skill
    .destroy({
      where: { id },
    })
    .then(removedSkill => {
      removedSkill
        ? res.json({ success: 'Successfully removed the skill' })
        : res.status(404).json({ error: 'Skill is not found' });
    })
    .catch(err => res.json({ error: 'Failed to remove the skill due to an error' }));
};

exports.updateSkill = (req, res) => {
  const { id } = req.params;
  const { skill } = req.body;

  Skill
    .update(
      {
        name: skill.name,
      },
      {
        where: { id },
      },
    )
    .then(result => {
      result[0] > 0
        ? res.json({ success: 'Successfully updated the skill' })
        : res.status(403).json({ error: 'Already updated or failed to update due to invalid skill' });
    })
    .catch(err => res.status(403).json({ error: 'Failed to update the skill' }));
};

exports.getSkillUsers = (req, res) => {
  const { id } = req.params;

  Skill
    .findOne({
      where: { id },
      attributes: skillParams,
      include: {
        association: 'users',
        attributes: userParams,
        through: {
          attributes: [],
        },
      },
    })
    .then(skill => {
      skill
        ? res.json({ skill })
        : res.status(404).json({ error: 'Skill is not found' });
    });
};
