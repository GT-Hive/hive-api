'use strict';

const db = require('../../models');
const eventParams = [
  'id',
  'name',
  'description',
  'event_date',
  'start_time',
  'end_time',
  'cover_img',
  'created_at',
  'updated_at',
];
const userParams = [
  'id',
  'email',
  'first_name',
  'last_name',
  'intro',
  'profile_img',
];

exports.getEvents = (req, res) => {

  db.Event
    .findAll({
      attributes: eventParams,
      include: {
        association: 'users',
        attributes: userParams,
        through: {
          attributes: ['is_host'],
        },
      },
    })
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get events' }));
};

exports.getEvent = (req, res) => {
  const { id } = req.params;

  db.Event
    .findOne({
      where: { id },
      attributes: eventParams,
      include: {
        association: 'users',
        attributes: userParams,
        through: {
          attributes: [],
          where: { is_host: false },
        },
      },
    })
    .then(event => {
      event
        ? res.json({ event })
        : res.status(404).json({ error: 'Event is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the event' }));
};

exports.getEventGuests = (req, res) => {
  const { id } = req.params;

  db.Event
    .findOne({
      where: { id },
      include: [
        {
          association: 'users',
          attributes: userParams,
          through: {
            attributes: [],
            where: { is_host: false },
          },
        },
      ],
    })
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event is not found' });

      event.users
        ? res.json({ users: event.users })
        : res.status(404).json({ error: 'Users from the event are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get users from the event' }));
};
