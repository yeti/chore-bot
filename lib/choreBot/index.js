'use strict';

let config = require('../../config.js');
var cron = require('node-cron');
let db = require('./db');
let SlackBot = require('slackbots');
let _ = require('lodash');

let Chorebot = class ChoreBot {

	constructor() {
		console.dir('* enter constructor');
		return this.init();
	}

	// Getters

	get apiToken() {
		return config.bot.apiToken;
	}

	get channel() {
		return config.bot.channel;
	}

	get name() {
		return config.bot.name;
	}

	get params() {
		return {
			icon_emoji: config.bot.emoji,
		};
	}

	// Methods
	buildUserMap() {
		console.dir('* enter buildUserMap');
		return this.slack.getUsers()
			.then((response) => {
				if (response.ok) {
					this.userNamesById = new Map();
					this.userIdsByName = new Map();
					_.forEach(response.members, (member) => {
						this.userNamesById.set(member.id, member.name);
						this.userIdsByName.set(member.name, member.id);
					});

					console.dir('~~~~~~~~~~~~~~~~~');
					console.dir('User map');
					console.dir(this.userNamesById);
					console.dir('~~~~~~~~~~~~~~~~~');

					return this.userNamesById;
				} else {
					console.log('error getting users');
					console.dir(response);
					//reject(response.errors);
				}
			});
	}

	buildChannelMap() {
		console.dir('* enter buildChannelMap');
		return this.slack.getChannels()
			.then((response) => {
				if (response.ok) {
					this.channelNamesById = new Map();
					_.forEach(response.channels, (channel) => {
						this.channelNamesById.set(channel.id, channel.name);
					});

					console.dir('~~~~~~~~~~~~~~~~~');
					console.dir('Channel map');
					console.dir(this.channelNamesById);
					console.dir('~~~~~~~~~~~~~~~~~');

					return this.channelNamesById;
				} else {
					console.log('error getting channels');
					//reject(response.errors);
				}
			});
	}

	// async
	getData() {
		return db.getData();
	}

	getChannelName(id) {
		return this.channelNamesById.get(id);
	}

	getOverviewMessage() {
		console.dir('* enter getOverviewMessage');

		return this.getData()
			.then((results) => {
				console.dir(results);

				let overviewMessage = `Bla bla`;

				_.forEach(results.choresList, (chore) => {
					overviewMessage += `\n${chore.overviewMessage}`;
				});

				return overviewMessage;
			});
	}

	getUserName(id) {
		return this.userNamesById.get(id);
	}

	healthCheck() {
		console.dir('* enter healthCheck');
		let bot = this;
		return this.getData()
			.then((results) => {
				//console.dir(results);

				_.forEach(results.choresList, (chore) => {
					_.forEach(chore.assignees, (assignee) => {
						if (bot.userIdsByName.has(assignee.name)) {
							console.dir(` ## ${assignee.name} found`);
						} else {
							console.dir(` ## ${assignee.name} NOT FOUND`);
						}
					});
				});
			});
	}

	handlePrivateMessage(data) {
		console.log(`\n------------\nIncoming message:\nText: ${data.text}\nFrom: ${data.user} -> ${this.getUserName(data.user)}\nIn: ${data.channel} -> ${this.getChannelName(data.channel) ? this.getChannelName(data.channel) : 'pm'}`);
	}

	handleChannelMention(data) {
		console.log(`\n------------\nChannel mention:\nText: ${data.text}\nFrom: ${data.user} -> ${this.getUserName(data.user)}\nIn: ${data.channel} -> ${this.getChannelName(data.channel) ? this.getChannelName(data.channel) : 'pm'}`);
	}

	init() {
		console.dir('* enter init');

		return new Promise((resolve, reject) => {

			console.dir(this.apiToken);

			this.slack = new SlackBot({
				token: this.apiToken,
				name: this.name,
			});

			this.slack.on('start', () => {
				this.onSlackStart(resolve);
			});

			this.slack.on('message', (data) => {
				this.onSlackMessage(data);
			});
		});
	}

	onSlackStart(resolve, reject) {
		console.dir('* enter onSlackStart');
		console.dir('Connected to slack!');

		Promise.all([this.buildUserMap(), this.buildChannelMap()])
			.then(() => {
				return this.healthCheck();
			})
			.then(() => {
				return this.scheduleChores();
			})
			.then(resolve)
			.catch(reject);
	}

	onSlackMessage(data) {
		console.dir('* enter onSlackMessage');

		// If message from someone other than self
		if (data.type === 'message' && data.user) {
			// if is private message or is mention
			if (!this.getChannelName(data.channel)) {
				this.handlePrivateMessage(data);
			} else if (data.text.contains(`${this.name}`)) {
				this.handleChannelMention(data);
			}
		}
	}

	sendOverviewMessage() {
		console.dir('* enter sendOverviewMessage');
		return this.getOverviewMessage()
			.then((message) => {
				console.dir(message);
				this.slack.postMessageToChannel(this.channel, message, this.params);
			});
	}

	sendReminderMessage(chore) {
		_.forEach(chore.assignees, (assignee) => {
			//console.dir(assignee);
			this.slack.postMessageToUser(assignee.username, chore.reminderMessage, this.params);
		});
	}

	scheduleChores() {
		console.dir('* enter scheduleChores');
		let bot = this;
		return this.getData()
			.then((results) => {
				//console.dir(results);
				_.forEach(results.choresList, (chore) => {
					cron.schedule(chore.frequency, function() {
						console.log(`Chore time! ${chore.name} - ${chore.frequency}`);
						bot.sendReminderMessage(chore);
					});
				});
			});
	}
};
module.exports = Chorebot;
