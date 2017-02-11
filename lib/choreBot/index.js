'use strict';

let config = require('../../config.js');
var cron = require('node-cron');
let db = require('./db');
let SlackBot = require('slackbots');
let _ = require('lodash');

let Chorebot = class ChoreBot {

	constructor() {
		return this.init();
	}

	// Getters

	get apiToken() {
		return config.bot.apiToken;
	}

	get channel() {
		return config.bot.channel;
	}

	get debugChannel() {
		return config.bot.debugChannel;
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
		return this.slack.getUsers()
			.then((response) => {
				if (response.ok || true) { // TODO figure out why response.ok is not sent anymore
					this.userNamesById = new Map();
					this.userIdsByName = new Map();
					_.forEach(response.members, (member) => {
						this.userNamesById.set(member.id, member.name);
						this.userIdsByName.set(member.name, member.id);
					});
					return this.userNamesById;
				} else {
					console.log('error getting users');
					this.log(response);
					//reject(response.errors);
				}
			});
	}

	buildChannelMap() {
		return this.slack.getChannels()
			.then((response) => {
				if (response.ok || true) { // TODO figure out why response.ok is not sent anymore
					this.channelNamesById = new Map();
					_.forEach(response.channels, (channel) => {
						this.channelNamesById.set(channel.id, channel.name);
					});

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
		return this.getData()
			.then((results) => {
				let overviewMessage = `@all Chores for the month:`;

				_.forEach(results.choresList, (chore) => {
					overviewMessage += `\n${chore.overviewMessage}`;
				});

				return overviewMessage;
			});
	}

	getUserName(id) {
		return this.userNamesById.get(id);
	}

	handlePrivateMessage(data) {
		let bot = this;
		this.log(`\n------------\nIncoming message:\nText: ${data.text}\nFrom: ${data.user} -> ${this.getUserName(data.user)}\nIn: ${data.channel} -> ${this.getChannelName(data.channel) ? this.getChannelName(data.channel) : 'pm'}`);
		const text = data.text;
		const userId = data.user;
		const userName = this.getUserName(data.user);


		let matchedUsers = [];

		return this.getData()
			.then((results) => {
				matchedUsers = _.filter(results.usersList, (user) => {
					return userName === user.username;
				});

				if (matchedUsers.length > 0) {
					let matchedUser = matchedUsers[0];
					this.log(`=> ${matchedUser.name} ${matchedUser.isAdmin ? 'IS ADMIN' : 'IS NOT ADMIN'}`);

					if (matchedUser.isAdmin && text.toLowerCase()
						.includes('refresh')) {
						this.log('=> Doing a refresh!');
						bot.refreshSchedule();
					}

					if (matchedUser.isAdmin && text.toLowerCase()
						.includes('announce')) {
						this.log('=> Doing an announcement!');
						bot.sendOverviewMessage();
					}
				}

				this.log(`----------------------------`);
			});
	}

	handleChannelMention(data) {
		console.dir(data);
		this.handlePrivateMessage(data);
	}

	init() {
		return new Promise((resolve, reject) => {

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

	log(message) {
		console.dir(`* ${message}`);
		if (this.slack) {
			this.slack.postMessageToChannel(this.debugChannel, message, this.params);
		}
		return message;
	}

	onSlackStart(resolve, reject) {
		this.log('===================');
		this.log('Connected to slack');
		this.log('===================');

		Promise.all([this.buildUserMap(), this.buildChannelMap()])
			.then(() => {
				return this.scheduleChores();
			})
			.then(resolve)
			.catch(reject);
	}

	onSlackMessage(data) {
		// If message from someone other than self
		if (data.type === 'message' && data.user) {
			console.dir(data);
			// if is private message or is mention
			if (!this.getChannelName(data.channel)) {
				console.dir('pm');
				this.handlePrivateMessage(data);
			} else {
				console.dir('channel');
				this.handleChannelMention(data);
			}
		}
	}

	refreshSchedule() {
		this.log('=> Destroying all reminders!');
		_.forEach(this.scheduledReminders, (reminder) => {
			reminder.destroy();
		});
		this.scheduleChores();
	}

	sendOverviewMessage() {
		return this.getOverviewMessage()
			.then((message) => {
				this.log(`${this.channel} ->\n${message}`);
				this.slack.postMessageToChannel(this.channel, message, this.params);
			});
	}

	sendReminderMessage(chore) {
		let bot = this;
		_.forEach(chore.assignees, (assignee) => {
			bot.log(`${assignee.username} -> ${chore.reminderMessage}`);
			this.slack.postMessageToUser(assignee.username, chore.reminderMessage, this.params);
		});
	}

	scheduleChores() {
		let bot = this;
		this.scheduledReminders = [];
		return this.getData()
			.then((results) => {
				//this.log(results);
				_.forEach(results.choresList, (chore) => {
					this.log(`Scheduled ${chore.name} ${chore.prettyFrequency}`);
					this.scheduledReminders.push(
						cron.schedule(chore.frequency, function() {
							bot.sendReminderMessage(chore);
						})
					);
				});
			});
	}
};
module.exports = Chorebot;
