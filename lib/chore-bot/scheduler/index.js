'use strict';

let _ = require('lodash');
let cron = require('node-cron');

let Scheduler = class Scheduler {
  constructor() {
    this.jobs = [];
  }

  schedule(task) {
    this.jobs.push(
      cron.schedule(task.cronExpression, task.task)
    );
  }
};
module.exports = Scheduler;
