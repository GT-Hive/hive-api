'use strict';

const db = require('../../../models');
const eventParams = [
  'id',
  'name',
  'description',
  'event_date',
  'start_time',
  'end_time',
  'cover_img',
];
const userParams = [
  'first_name',
  'last_name',
  'email',
];

exports.getUserEvents = (req, res) => {
  const { id } = req.params;

  db.sequelize
    .query(`
			SELECT
				${eventParams.map(p => 'E.' + p).join(', ')},
				${userParams.map(p => 'U.' + p).join(', ')},
      	Interest.name AS community_name,
      	Location.name AS location_name,
      	Location.room_number AS room_number
			FROM Event AS E
			LEFT OUTER JOIN (Community AS C INNER JOIN Interest ON C.interest_id = Interest.id)
			ON E.community_id = C.id
			LEFT OUTER JOIN Location ON E.location_id = Location.id
			LEFT OUTER JOIN (User_Event AS UE INNER JOIN User AS U ON UE.user_id = U.id)
			ON UE.event_id = E.id
			WHERE U.id = $id;
		`,
    {
      bind: { id },
      type: db.sequelize.QueryTypes.SELECT,
    },
    )
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get the events' }));
};

exports.getUserGuestEvents = (req, res) => {
  const { id } = req.params;

  db.sequelize
    .query(`
			SELECT
				${eventParams.map(p => 'E.' + p).join(', ')},
				${userParams.map(p => 'U.' + p).join(', ')},
      	Interest.name AS community_name,
      	Location.name AS location_name,
      	Location.room_number AS room_number
			FROM Event AS E
			LEFT OUTER JOIN (Community AS C INNER JOIN Interest ON C.interest_id = Interest.id)
			ON E.community_id = C.id
			LEFT OUTER JOIN Location ON E.location_id = Location.id
			LEFT OUTER JOIN (User_Event AS UE INNER JOIN User AS U ON UE.user_id = U.id)
			ON UE.event_id = E.id
			WHERE U.id = $id AND UE.is_host = false;
		`,
    {
      bind: { id },
      type: db.sequelize.QueryTypes.SELECT,
    },
    )
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Guest events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get guest events' }));
};

exports.getUserHostEvents = (req, res) => {
  const { id } = req.params;

  db.sequelize
    .query(`
			SELECT
				${eventParams.map(p => 'E.' + p).join(', ')},
				${userParams.map(p => 'U.' + p).join(', ')},
      	Interest.name AS community_name,
      	Location.name AS location_name,
      	Location.room_number AS room_number
			FROM Event AS E
			LEFT OUTER JOIN (Community AS C INNER JOIN Interest ON C.interest_id = Interest.id)
			ON E.community_id = C.id
			LEFT OUTER JOIN Location ON E.location_id = Location.id
			LEFT OUTER JOIN (User_Event AS UE INNER JOIN User AS U ON UE.user_id = U.id)
			ON UE.event_id = E.id
			WHERE U.id = $id AND UE.is_host = true;
		`,
    {
      bind: { id },
      type: db.sequelize.QueryTypes.SELECT,
    },
    )
    .then(events => {
      events
        ? res.json({ events })
        : res.status(404).json({ error: 'Host events are not found' });
    })
    .catch(err => res.status(403).json({ error: 'Cannot get host events' }));
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
  const { user } = res.locals;

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
      user
        .addEvent(event, {
          through: { is_host: true },
        })
        .then(() => res.json({ success: 'Successfully created the event' }))
        .catch(err => res.status(403).json({ error: 'Cannot create the event' }));
    })
    .catch(err => res.json({ error: 'Failed to create the event due to an error' }));
};

exports.removeHostEvent = (req, res) => {
  const { id, event_id } = req.params;

  db.Event
    .findOne({
      where: {
        id: event_id,
      },
      include: {
        association: 'User',
        where: { id },
        through: {
          where: { is_host: true },
        },
      },
    })
    .then(event => {
      if (!event) return res.status(403).json({
        error: 'Event is not found or you\'re not the creator of the event',
      });
      event.destroy()
        .then(() => res.json({ success: 'Successfully removed the event' }))
        .catch((err) => res.status(403).json({ error: 'Failed to remove the event' }));
    })
    .catch(err => res.status(404).json({ error: 'Event is not found' }));
};

exports.removeGuestEvent = (req, res) => {
  const { id, event_id } = req.params;

  db.User_Event
    .destroy({
      where: {
        event_id,
        user_id: id,
        is_host: false,
      },
    })
    .then(removedEvent => {
      removedEvent
        ? res.json({ success: 'Successfully removed the event' })
        : res.status(404).json({ error: 'Cannot find the event' });
    })
    .catch(err => res.json({ error: 'Failed to remove the event' }));
};

exports.addGuestEvent = (req, res) => {
  const { event_id } = req.params;
  const { user } = res.locals;

  db.Event
    .findOne({ where: { id: event_id } })
    .then(event => {
      if (!event) return res.status(404).json({ error: 'Event is not found' });

      user
        .addEvent(event)
        .then(() => res.json({ success: 'Successfully added the event' }))
        .catch(err => res.status(403).json({ error: 'Cannot add the event' }));
    })
    .catch(err => res.status(404).json({ error: 'Event is not found' }));
};

exports.updateHostEvent = (req, res) => {
  const { id, event_id } = req.params;
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

  db.User_Event
    .findOne({
      where: {
        event_id,
        user_id: id,
        is_host: true,
      },
    })
    .then(userEvent => {
      if (!userEvent) {
        return res.status(404).json({
          error: 'Cannot find the event or you are not the creator of the event',
        });
      }
      db.Event
        .update(
          {
            community_id,
            location_id,
            name,
            description,
            event_date,
            start_time,
            end_time,
            cover_img,
          },
          { where: { id: event_id } },
        )
        .then(result => {
          result[0] > 0
            ? res.json({ success: 'Successfully updated the event' })
            : res.status(403).json({ error: 'Already updated or failed to update due to invalid event' });
        })
        .catch(err => res.status(403).json({ error: 'Failed to update the event' }));
    })
    .catch(err => res.status(404).json({ error: 'Cannot find the event' }));
};
