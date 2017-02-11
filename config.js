'use strict';

let bot = {
	apiToken: process.env.API_TOKEN,
	name: "chorebot",
	emoji: ":unicorn_face:",
	channel: process.env.CHANNEL,
	debugChannel: process.env.DEBUG_CHANNEL,
};
module.exports.bot = bot;

let db = {
	choresKey: process.env.CHORES_KEY,
	usersKey: process.env.USERS_KEY,
};
module.exports.db = db;
