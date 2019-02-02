'use strict';

const db = require('../../../models');

exports.getEvents = (req, res) => {
	db.sequelize
		.query(`
      SELECT
      	E.id, E.name, E.description, E.event_date, E.start_time, E.end_time, E.cover_img, E.created_at, E.updated_at,
      	Interest.name AS community_name,
      	Location.name AS location_name, Location.room_number AS room_number
			FROM Event AS E
			LEFT OUTER JOIN (Community AS C INNER JOIN Interest ON C.interest_id = Interest.id)
			ON E.community_id = C.id
			LEFT OUTER JOIN Location ON E.location_id = Location.id;
    `,
			{ type: db.sequelize.QueryTypes.SELECT }
    )
		.then(events => {
			events
				? res.json({ events })
				: res.status(404).json({ error: 'Events are not found' });
		})
		.catch(err => res.status(403).json({ error: 'Cannot get events' }));
};

exports.getEvent = (req, res) => {
	const { id } = req.params;
	db.sequelize
		.query(`
      SELECT
      	E.id, E.name, E.description, E.event_date, E.start_time, E.end_time, E.cover_img, E.created_at, E.updated_at,
      	Interest.name AS community_name,
      	Location.name AS location_name, Location.room_number AS room_number
			FROM Event AS E
			LEFT OUTER JOIN (Community AS C INNER JOIN Interest ON C.interest_id = Interest.id)
			ON E.community_id = C.id
			LEFT OUTER JOIN Location ON E.location_id = Location.id
			WHERE E.id = $id;
    `,
			{ bind: { id }, type: db.sequelize.QueryTypes.SELECT }
		)
		.then(event => {
			event[0]
				? res.json({ event: event[0] })
				: res.status(404).json({ error: 'Event is not found' });
		})
		.catch(err => res.status(403).json({ error: 'Cannot get the event' }));
};

exports.createEvent = (req, res) => {
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
		}
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
		.then(() => res.json({ success: 'Successfully created the event' }))
		.catch(err => res.json({ error: 'Failed to create the event due to an error' }));
};

exports.removeEvent = (req, res) => {
	const { id } = req.params;

	db.Event
		.destroy({ where: { id } })
		.then(removedEvent => {
			removedEvent
				? res.json({ success: 'Successfully removed the event' })
				: res.status(404).json({ error: 'Event is not found' });
		})
		.catch(err => res.json({ error: 'Failed to remove the event due to an error' }));
};

exports.updateEvent = (req, res) => {
	const { id } = req.params;
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
		}
	} = req.body;

	db.Event
		.update({
			community_id,
			location_id,
			name,
			description,
			event_date,
			start_time,
			end_time,
			cover_img,
		}, { where: { id } })
		.then(result => {
			result[0] > 0
				? res.json({ success: 'Successfully updated the event' })
				: res.status(403).json({ error: 'Already updated or failed to update due to invalid event' });
		})
		.catch(err => res.status(403).json({ error: 'Failed to update the event' }));
};
