'use strict';

const locationParams = require('./locationHelper').attributes;
const interestParams = require('./interestHelper').attributes;
const userParams = require('./userHelper').attributes;

const eventHelper = {
  attributes: [
    'id',
    'name',
    'description',
    'event_date',
    'start_time',
    'end_time',
    'cover_img',
    'created_at',
    'updated_at',
  ],
  include: [
    {
      association: 'hosts',
      attributes: userParams,
    },
    {
      association: 'guests',
      attributes: userParams,
    },
    {
      association: 'location',
      attributes: locationParams,
    },
    {
      association: 'community',
      attributes: ['id'],
      include: {
        association: 'interest',
        attributes: interestParams,
      },
    },
  ],
};

module.exports = eventHelper;
