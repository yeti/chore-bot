'use strict';

let _ = require('lodash');
let request = require('request');
let cron = require('node-cron');

let config = require('../../config');

let Database = require('./database');

let Tanuki = require('tanuki');
let Scheduler = require('./scheduler');
let Ping = require('./tasks/ping');

let PingBot = class PingBot {
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
        console.dir(results);
        const chores = results[0];
        const persons = results[1];
      });


    /*
          .then((Chores, People) => {
            return HerokuApp.query({})
              .then((apps) => {
                this.apps = apps;
                this.scheduleApps();
              });
          });*/
  }

  scheduleApps() {
    _.forEach(this.apps, (app) => {

      let pingTask = new Ping(app, {
        frequency: config.frequency,
        request: this.getRequest(),
      });

      this.log('==================');
      this.log(`scheduling ${pingTask.app.endPoint} ${pingTask.cronExpression}`);

      this.scheduler.schedule(pingTask);
    });
  }

  getRequest() {
    return request;
  }

  log(message) {
    if (!config.silent) {
      console.dir(message);
    }
  }
};
module.exports = PingBot;
