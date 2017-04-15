'use strict';

process.env.SILENT = true;

let chai = require('chai');
chai.should();

let sinon = require('sinon');
let Ping = require('../lib/ping-bot/tasks/ping');

describe('ping', function() {

  it('should generate the right cron expression vanilla', function() {
    // Given
    let ping = new Ping({
      wakeUpTime: 0
    }, {
      frequency: '*/3'
    });

    // Then
    ping.cronExpression.should.equal('*/3 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16 * * *');
  });

  it('should generate the right cron expression spanning 2 days', function() {
    // Given
    let ping = new Ping({
      wakeUpTime: 18
    }, {
      frequency: '*/4'
    });

    // Then
    ping.cronExpression.should.equal('*/4 18,19,20,21,22,23,0,1,2,3,4,5,6,7,8,9,10 * * *');
  });

});
