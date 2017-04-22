'use strict';

const cron = require('node-cron');

const Scheduler = class Scheduler {
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
