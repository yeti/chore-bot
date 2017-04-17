'use strict';

process.env.SILENT = true;

let chai = require('chai');
chai.should();
let assert = chai.assert;

let sinon = require('sinon');

let ChoreBot = require('../lib/chore-bot');

let appSpreadsheet = require('./data/app-spreadsheet');

describe('db', function() {
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
    bot = new ChoreBot();
    getDocStub = sinon.stub(bot.database, "getSpreadsheet", () => (appSpreadsheet));
  });

  afterEach(function() {
    // runs after each test in this block
    getDocStub.restore();
  });

  function setTime(hour) {
    let now = new Date();
    clock = sinon.useFakeTimers(now.setHours(hour));
  }

  it('should load spreadsheet', function(done) {
    // Given

    // When
    bot.init()
      .then(() => {
        // Then
        bot.chores.should.have.lengthOf(2);
        bot.persons.should.have.lengthOf(4);

        let chores = bot.chores;

        chores[0].name.should.equal('chore 1');
        chores[0].frequency.should.equal('0 17 * * 2');
        // apps[0].prettyFrequency.should.equal('http://bot-1.herokuapp.com');
        chores[0].assignees.length.should.equal(3);
        // chores[0].assignees.should.equal(['guy f', 'jimmy', 'nico']);
        chores[0].reminder.should.equal('Do chore 1, pls');

        chores[1].name.should.equal('chore 2');
        chores[1].frequency.should.equal('*/10 * * * * *');
        // apps[1].prettyFrequency.should.equal('http://bot-1.herokuapp.com');
        chores[1].assignees.length.should.equal(2);
        // chores[1].assignees.should.equal(['unknown person', 'randy']);
        chores[1].reminder.should.equal('Hey, clean the stuff');

        done();
      }).catch(e => {
        console.dir(`Error ${e}`);
      });
  });
/*
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
  */
});
