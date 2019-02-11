'use strict';

const db = require('../../models');
const userParams = require('../../lib/userHelper').attributes;
const {
  include,
  attributes,
} = require('../../lib/eventHelper');

exports.getEvents = (req, res) => {
  db.Event
    .findAll({
      attributes,
      include,
    })
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Events are not found' });
    })
    .catch(err => {
      console.log(err);
      res.status(403).json({ error: 'Cannot get events' })});
};

exports.getEvent = (req, res) => {
  const { id } = req.params;

  db.Event
    .findOne({
      where: { id },
      attributes,
      include,
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
          association: 'guests',
          attributes: userParams,
        },
      ],
    })
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event is not found' });

      const { guests } = event;
      guests
        ? res.json({ guests })
        : res.status(404).json({ error: 'Event guests are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get guests from the event' }));
};

exports.getEventHosts = (req, res) => {
  const { id } = req.params;

  db.Event
    .findOne({
      where: { id },
      include: [
        {
          association: 'hosts',
          attributes: userParams,
        },
      ],
    })
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event is not found' });

      const { hosts } = event;
      hosts
        ? res.json({ hosts })
        : res.status(404).json({ error: 'Event hosts is not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get hosts from the event' }));
};
