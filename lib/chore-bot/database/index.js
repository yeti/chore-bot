'use strict';

let config = require('../../../config');
let Tanuki = require('tanuki');
let prettyCron = require('prettyCron');
let _ = require('lodash');

let GoogleSpreadsheet = Tanuki.GoogleSpreadsheet;
let Mapping = Tanuki.Mapping;
let Model = Tanuki.Model;
let Schema = Tanuki.Schema;
let Spreadsheet = Tanuki.Spreadsheet;

let Database = class Database {
  constructor() {
    this.db = new Tanuki();
  }

  init() {
    return this.db.loadSpreadsheet(this.spreadsheet);
  }

  get spreadsheet() {
    return new GoogleSpreadsheet(config.db.token);
  }

  get Chore() {
    return new Model(this.choreSchema, this.db, config.db.choresWorksheetId);
  }

  get Person() {
    return new Model(this.personSchema, this.db, config.db.peopleWorksheetId);
  }

  get choreSchema() {
    return new Schema([
      new Mapping('Assignees', 'assignees', assignees => assignees.split(',')
        .map(assignee => assignee.trim())),
      new Mapping('Name', 'name'),
      new Mapping('Frequency', 'frequency'),
      new Mapping('Frequency', 'prettyFrequency', prettyCron.toString),
      new Mapping('Reminder', 'reminder'),
    ]);
  }

  get personSchema() {
    return new Schema([
      new Mapping('Name', 'name', _.capitalize),
      new Mapping('Username', 'username'),
      new Mapping('Is Admin', 'isAdmin', value => value === 'TRUE'),
    ]);
  }
};
module.exports = Database;
