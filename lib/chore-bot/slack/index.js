'use strict';

const SlackBot = require('slackbots');

const Slack = class Slack {

  /**
   * INIT
   */

  constructor() {
    this.slackbot = new SlackBot({
      token: this.apiToken,
      name: this.name,
    });

    this.onDirectMessage = (data) => {
      console.dir(data);
    };
  }

  init() {
    return new Promise((resolve, reject) => {
      this.slackbot.on('start', () => {
        this.onStart(resolve, reject);
      });

      this.slackbot.on('message', (data) => {
        this.onMessage(data);
      });
    });
  }

  setOnDirectMessage(onDirectMessage) {
    this.onDirectMessage = onDirectMessage;
  }

  /**
   * GETTERS
   */

  get config() {
    return _.get(config, 'slack');
  }

  get apiToken() {
    return _.get(this.config, 'token');
  }

  get name() {
    return _.get(this.config, 'name');
  }

  get emoji() {
    return _.get(this.config, 'emoji');
  }

  get channel() {
    return _.get(this.config, 'channel');
  }

  get debugChannel() {
    return _.get(this.config, 'debugChannel');
  }

  get params() {
    return {
      icon_emoji: this.emoji,
    };
  }

  /**
   * METHODS
   */

  log(msg) {
    console.dir(`* ${msg}`);
    if (this.slackbot) {
      this.slackbot.postMessageToChannel(this.debugChannel, msg, this.params);
    }
    return msg;
  }

  onStart(resolve, reject) {
    this.log('===================');
    this.log('Connected to slack');
    this.log('===================');

    Promise.all([this.fetchUsers(reject), this.fetchChannels(reject)])
      .then(() => {
        //return this.scheduleChores();
        resolve();
      })
      .catch((e) => {
        this.log(e);
        reject(e);
      });
  }

  onMessage(data, onDirectMessage) {
    if (this.isChannelMessage(data)) {
      //this.messageUser('nicolas', 'spoof');
    } else if (this.isDirectMessage(data)) {
      this.onDirectMessage(data);
      //this.messageUser('nicolas', 'doof');
    }
  }

  isMessage(data) {
    return data.type === 'message' && data.user;
  }

  isMessageFromChannel(data) {
    return !!this.findChannel(data.channel);
  }

  isDirectMessage(data) {
    return this.isMessage(data) && !this.isMessageFromChannel(data);
  }

  isChannelMessage(data) {
    return this.isMessage(data) && this.isMessageFromChannel(data);
  }

  findChannel(id) {
    return _.find(this.channels, channel => channel.id === id);
  }

  getIdentity(id) {
    return this.getUserNameById() || this.getChannelNameById();
  }

  messageUser(username, message) {
    this.message(this.getUserIdByName(username), message);
  }

  message(id, message) {
    this.log(`${id}(${this.getIdentity(id)}) -> ${message}`);
    this.slackbot.postMessage(id, message, this.params);
  }

  fetchUsers(reject) {
    return this.slackbot.getUsers()
      .then((response) => {
        this.users = _.get(response, 'members');
      })
      .catch((e) => {
        this.log(e);
        reject(e);
      });
  }

  getUserById(id) {
    return _.find(this.users, user => user.id === id);
  }

  getChannelById(id) {
    console.dir(this.channels);
    return _.find(this.channels, channel => channel.id === id);
  }

  getUserByName(name) {
    return _.find(this.users, user => user.name === name);
  }

  getUserNameById(id) {
    return _.get(this.getUserById(id), 'name');
  }

  getChannelNameById(id) {
    return _.get(this.getChannelById(id), 'name');
  }

  getUserIdByName(name) {
    return _.get(this.getUserByName(name), 'id');
  }

  fetchChannels(reject) {
    return this.slackbot.getChannels()
      .then((response) => {
        this.channels = _.get(response, 'channels');
      })
      .catch((e) => {
        this.log(e);
        reject(e);
      });
  }
};
module.exports = Slack;
