'use strict';

let SlackBot = require('slackbots');
let config = require('../config.js');
let db = require('./db.js');

console.dir(config);

// create a bot
let bot = new SlackBot({
	token: config.bot.apiToken,
	name: config.bot.name
});
module.exports.bot = bot;


let chores = db.getData();
