'use strict';

const request = require('request');
const cron = require('node-cron');

const config = require('../../config');

const Database = require('./database');
const Slack = require('./slack');
const Recast = require('./recast');
const Brain = require('./brain');

const Tanuki = require('tanuki');
const Scheduler = require('./scheduler');
const Ping = require('./tasks/ping');

const PingBot = class PingBot {
  constructor() {
    this.database = new Database();
    this.scheduler = new Scheduler();
  }

  init() {
    return this.database.init()
      .then(() =>
        (
          Promise.all([
            this.database.Chore.query({}),
            this.database.Person.query({}),
          ])
        )
      )
      .then((results) => {
        this.chores = results[0];
        this.persons = results[1];

        this.slack = new Slack();
        this.recast = new Recast();

        this.wireUpTheBrains();

        return this.slack.init();
      })
      .then(() => {
        console.dir('spoof');
      });
  }

  wireUpTheBrains() {
    this.slack.setOnDirectMessage((data) => {
      this.recast.converse(data.text, data.channel);
    });

    this.recast.setOnReply((response) => {
      if (this.shouldResetConversation(response)) {
        response.resetConversation();
      }

      _.forEach(_.get(response, 'replies', []), reply => {
        this.slack.message(_.get(response, 'conversationToken', ''), reply);
      });
    });
  }

  shouldScold(response) {
    return _.get(response, 'action.slug') === 'chore-reminder' && _.get(response, 'action.done') === true;
  }

  shouldResetConversation(response) {
    return _.get(response, 'action.done') === true;
  }

  findResponsible(response) {
    const chore = _.get(response, 'memory.chore.value');
  }

};
module.exports = PingBot;
