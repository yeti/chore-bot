'use strict';

process.env.SILENT = true;

let chai = require('chai');
chai.should();

let sinon = require('sinon');

let PingBot = require('../lib/ping-bot');

let appSpreadsheet = require('./data/app-spreadsheet');

describe('ping-bot', function() {
  let clock;
  let spy;
  let requestStub;
  let queryStub;
  let db;
  let bot;
  let getDocStub;


  let requestMock = {
    get: (endpoint) => {},
  };

  beforeEach(function() {
    // runs before each test in this block
    bot = new PingBot();
    getDocStub = sinon.stub(bot.database, "getGoogleSpreadsheet", () => (appSpreadsheet));
  });

  afterEach(function() {
    // runs after each test in this block
    getDocStub.restore();
  });

  function setTime(hour) {
    let now = new Date();
    clock = sinon.useFakeTimers(now.setHours(hour));
  }

  it('should load apps', function(done) {
    // Given
    requestStub = sinon.stub(bot, "getRequest", () => (requestMock));

    // When
    bot.init()
      .then(() => {
        // Then
        bot.scheduler.jobs.should.have.lengthOf(4);
        bot.apps.should.have.lengthOf(4);

        let apps = bot.apps;

        apps[0].wakeUpTime.should.equal(0);
        apps[0].domainName.should.equal('bot-1');
        apps[0].endPoint.should.equal('http://bot-1.herokuapp.com');

        apps[1].wakeUpTime.should.equal(8);
        apps[1].domainName.should.equal('bot-2');
        apps[1].endPoint.should.equal('http://bot-2.herokuapp.com');

        apps[2].wakeUpTime.should.equal(16);
        apps[2].domainName.should.equal('bot-3');
        apps[2].endPoint.should.equal('http://bot-3.herokuapp.com');

        apps[3].wakeUpTime.should.equal(5);
        apps[3].domainName.should.equal('my-app');
        apps[3].endPoint.should.equal('http://my-app.herokuapp.com');

        requestStub.restore();
        done();
      });
  });

  it('should schedule apps', function(done) {
    // Given
    requestStub = sinon.stub(bot, "getRequest", () => (requestMock));

    spy = sinon.spy(requestMock, "get");
    setTime(6);

    // When
    bot.apps = [{
        wakeUpTime: 0,
        endPoint: 'http://bot-1.herokuapp.com',
      },
      {
        wakeUpTime: 8,
        endPoint: 'http://bot-2.herokuapp.com',
      },
      {
        wakeUpTime: 16,
        endPoint: 'http://bot-3.herokuapp.com',
      },
      {
        wakeUpTime: 5,
        endPoint: 'http://my-app.herokuapp.com',
      },
    ];
    bot.scheduleApps();

    clock.tick(1000 * 60 * 5);

    // Then
    spy.calledThrice.should.be.true;
    spy.getCall(0)
      .args[0].should.equal('http://bot-1.herokuapp.com');
    spy.getCall(1)
      .args[0].should.equal('http://bot-3.herokuapp.com');
    spy.getCall(2)
      .args[0].should.equal('http://my-app.herokuapp.com');

    requestStub.restore();
    spy.restore();
    done();
  });
});
