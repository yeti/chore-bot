'use strict';

// Imports
let Tanuki = require('tanuki');
let Mock = Tanuki.Mock;

let Info = Mock.Info;
let GoogleSpreadsheet = Mock.GoogleSpreadsheet;
let Worksheet = Mock.Worksheet;

// Test Data
let error = false;

let appWorksheet = new Worksheet('app sheet', '987654321', [{
    domain: 'bot-1',
    wakeuptime: '0',
  },
  {
    domain: 'bot-2',
    wakeuptime: '8',
  },
  {
    domain: 'bot-3',
    wakeuptime: '16',
  },
  {
    domain: 'my-app',
    wakeuptime: '5',
  },
], false);

let worksheets = [appWorksheet];

let info = new Info(worksheets);

let spreadsheet = new GoogleSpreadsheet('app-key-123412341234', info, error);

module.exports = spreadsheet;
