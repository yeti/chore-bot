'use strict';

let Ping = class Ping {
  constructor(app, config) {
    this.app = app;
    this.frequency = config.frequency;
    this.request = config.request;
  }

  get cronExpression() {
    return `${this.frequency} ${this.cronHours} * * *`;
  }

  get task() {
    return () => {
      this.request.get(this.app.endPoint, (err, res, body) => {
        this.log(`------------------------`);
        this.log(`${this.app.endPoint} ATTEMPTED`);
        if (!err && res.statusCode == 200) {
          this.log(`SUCCESS`);
        } else {
          this.log(`ERROR: ${err}`);
        }
      });
    };
  }

  get cronHours() {
    let hours = '';
    for (let i = 0; i < this.nHoursOfAwake; i++) {
      hours += `${(this.app.wakeUpTime + i) % 24}`;
      hours += `${i < (this.nHoursOfAwake - 1) ? ',' : ''}`;
    }
    return hours;
  }

  get nHoursOfAwake() {
    return 17;
  }

  log(message) {
    console.dir(message);
  }
};
module.exports = Ping;
