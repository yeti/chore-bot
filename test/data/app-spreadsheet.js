'use strict';

// Imports
let Tanuki = require('tanuki');
let Mock = Tanuki.Mock;

let Info = Mock.Info;
let GoogleSpreadsheet = Mock.GoogleSpreadsheet;
let Worksheet = Mock.Worksheet;

// Test Data
let error = false;

let choresWorksheet = new Worksheet('chores', '987654321', [{
    name: 'chore 1',
    frequency: '0 17 * * 2',
    assignees: 'guy f, jimmy, nico',
    reminder: 'Do chore 1, pls',
  },
  {
    name: 'chore 2',
    frequency: '*/10 * * * * *',
    assignees: 'unknown person, randy',
    reminder: 'Hey, clean the stuff',
  },
], false);

let peopleWorksheet = new Worksheet('people', '987654321', [{
    name: 'guy f',
    username: 'guyf',
    isadmin: 'FALSE',
  },
  {
    name: 'jimmy',
    username: 'jimbo',
    isadmin: 'FALSE',
  },
  {
    name: 'nico',
    username: 'nico',
    isadmin: 'TRUE',
  },
  {
    name: 'randy',
    username: 'randy',
    isadmin: 'FALSE',
  },
], false);

let worksheets = [choresWorksheet, peopleWorksheet];

let info = new Info(worksheets);

let spreadsheet = new GoogleSpreadsheet('app-key-123412341234', info, error);

module.exports = spreadsheet;
