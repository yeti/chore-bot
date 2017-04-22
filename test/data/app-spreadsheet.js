'use strict';

// Imports
const Tanuki = require('tanuki');
const Mock = Tanuki.Mock;

const Info = Mock.Info;
const GoogleSpreadsheet = Mock.GoogleSpreadsheet;
const Worksheet = Mock.Worksheet;

// Test Data
const error = false;

const choresWorksheet = new Worksheet('chores', '987654321', [{
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

const peopleWorksheet = new Worksheet('people', '987654321', [{
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

const worksheets = [choresWorksheet, peopleWorksheet];

const info = new Info(worksheets);

const spreadsheet = new GoogleSpreadsheet('app-key-123412341234', info, error);

module.exports = spreadsheet;
