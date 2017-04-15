'use strict';

let slack = {
  token: process.env.SLACK_TOKEN,
  name: "chorebot",
  emoji: ":unicorn_face:",
  channel: process.env.CHANNEL,
  debugChannel: process.env.DEBUG_CHANNEL,
};
module.exports.slack = slack;

let db = {
  token: process.env.DB_TOKEN,
  choresWorksheetId: 'chores',
  peopleWorksheetId: 'people',
};
module.exports.db = db;

let recast = {
  token: process.env.RECAST_TOKEN,
};
module.exports.recast = recast;
