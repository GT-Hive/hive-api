'use strict';

const db = require('../../../models');
const userParams = require('../../../lib/userHelper').attributes;
const { attributes } = require('../../../lib/eventHelper');

exports.getUserEvents = (req, res) => {
  const { id } = req.params;

  db.User
    .findOne({
      where: { id },
      attributes: [],
      include: [
        {
          association: 'host_events',
          attributes,
          through: {
            attributes: [],
          },
        },
        {
          association: 'guest_events',
          attributes,
          through: {
            attributes: [],
          },
        },
      ],
    })
    .then(events => {
      events
        ? res.json({
          host_events: events.host_events,
          guest_events: events.guest_events,
        })
        : res.status(404).json({ error: 'Events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the events' }));
};

exports.getUserGuestEvents = (req, res) => {
  const { id } = req.params;

  db.User
    .findOne({
      where: { id },
      attributes: [],
      include: [
        {
          association: 'guest_events',
          attributes,
          through: {
            attributes: [],
          },
        },
      ],
    })
    .then(events => {
      if (!events || (events && !events.guest_events)) {
        return res.status(404).json({ error: 'Guest events are not found' });
      }
      res.json({
        guest_events: events.guest_events,
      });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the guest events' }));
};

exports.getUserHostEvents = (req, res) => {
  const { id } = req.params;

  db.User
    .findOne({
      where: { id },
      attributes: [],
      include: [
        {
          association: 'host_events',
          attributes,
          through: {
            attributes: [],
          },
        },
      ],
    })
    .then(events => {
      if (!events || (events && !events.host_events)) {
        return res.status(404).json({ error: 'Host events are not found' });
      }
      res.json({
        host_events: events.host_events,
      });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the host events' }));
};

exports.createHostEvent = (req, res) => {
  const {
    event: {
      community_id,
      location_id,
      name,
      description,
      event_date,
      start_time,
      end_time,
      cover_img,
    },
  } = req.body;

  db.Event
    .create({
      community_id,
      location_id,
      name,
      description,
      event_date,
      start_time,
      end_time,
      cover_img,
    })
    .then((event) => {
      db.Host
        .create({
          user_id: res.locals.user.id,
          event_id: event.id,
        })
        .then(() => res.json({ success: 'Successfully created the event' }))
        .catch(err => res.status(403).json({ error: 'Cannot create the event' }));
    })
    .catch(err => res.json({ error: err }));
};

exports.removeHostEvent = (req, res) => {
  const {
    id,
    event_id,
  } = req.params;

  db.Event
    .findOne({
      where: {
        id: event_id,
      },
      include: {
        association: 'hosts',
      },
    })
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event is not found' });
      }
      if (event && event.hosts[0].id !== parseInt(id)) {
        return res.status(403).json({ error: 'You\'re not the event host to delete the event' });
      }
      event.destroy()
        .then(() => res.json({ success: 'Successfully removed the event' }))
        .catch((err) => res.status(403).json({ error: 'Failed to remove the event' }));
    })
    .catch(err => res.status(404).json({ error: 'Event is not found' }));
};

exports.addGuestEvent = (req, res) => {
  const {
    event_id,
    id,
  } = req.params;

  db.Event
    .findOne({
      where: {
        id: event_id,
      },
      include: {
        association: 'hosts',
      },
    })
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event is not found' });
      }
      if (event && event.hosts[0].id === parseInt(id)) {
        return res.status(403).json({ error: 'Event host cannot add the same event as guest' });
      }

      db.Guest
        .create({
          user_id: id,
          event_id,
        })
        .then(() => res.json({ success: 'Successfully added the event as a guest' }))
        .catch(err => res.status(403).json({ error: 'Already added the event as a guest' }));
    })
    .catch(err => res.status(404).json({ error: 'Event is not found' }));
};

exports.removeGuestEvent = (req, res) => {
  const {
    id,
    event_id,
  } = req.params;

  db.Guest
    .destroy({
      where: {
        event_id,
        user_id: id,
      },
    })
    .then(removedEvent => {
      removedEvent
        ? res.json({ success: 'Successfully removed the guest event' })
        : res.status(404).json({ error: 'Cannot find the guest event' });
    })
    .catch(err => res.json({ error: 'Failed to remove the guest event' }));
};


exports.updateHostEvent = (req, res) => {
  const {
    id,
    event_id,
  } = req.params;
  const {
    event: {
      community_id,
      location_id,
      name,
      description,
      event_date,
      start_time,
      end_time,
      cover_img,
    },
  } = req.body;

  db.Event
    .findOne({
      where: {
        id: event_id,
      },
      include: {
        association: 'hosts',
      },
    })
    .then(event => {
      if (!event) {
        return res.status(404).json({ error: 'Event is not found' });
      }
      if (event && event.hosts[0].id !== parseInt(id)) {
        return res.status(403).json({ error: 'You\'re not the event host to update the event' });
      }
      event
        .update({
          community_id,
          location_id,
          name,
          description,
          event_date,
          start_time,
          end_time,
          cover_img,
        })
        .then(result => {
          result
            ? res.json({ success: 'Successfully updated the event' })
            : res.status(403).json({ error: 'Already updated or failed to update due to invalid event' });
        })
        .catch(err => res.status(403).json({ error: 'Failed to update the event' }));
    })
    .catch(err => res.status(404).json({ error: 'Cannot find the event' }));
};
