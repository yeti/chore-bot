'use strict';

// Modules
let GoogleSpreadsheet = require('google-spreadsheet');
let Chore = require('./models/chore');
let User = require('./models/user');
let config = require('../config.js');
let _ = require('lodash');


let getRowsFromSheet = function(sheetKey, orderby) {
	// Init
	let doc = new GoogleSpreadsheet(sheetKey);
	let sheet;

	// Spin up promise
	let promise = new Promise(function(resolve, reject) {

		// Get doc
		doc.getInfo(function(err, info) {

			// Handle error
			if (err) {
				reject(err);
			}

			// Grab first sheet
			try {
				sheet = info.worksheets[0];
			} catch (e) {
				reject(e);
				return;
			}


			// Grab rows
			sheet.getRows({
				offset: 1,
				limit: 100,
				orderby: orderby
			}, function(err, rows) {

				// Handle Error
				if (err) {
					reject(err);
				}

				// Resolve Promise
				resolve(rows);
			});
		});
	});
	return promise;
};

let getChores = function() {
	return getRowsFromSheet(config.db.choresKey, 'col1');
};

let getUsers = function() {
	return getRowsFromSheet(config.db.usersKey, 'col1');
};

let getData = function() {
	Promise.all([getChores(), getUsers()])
		.then(values => {

			let choresList = [];
			let usersList = [];

			_.map(values[1], (row => {
				usersList.push(new User(row));
			}));

			_.map(values[0], (row => {
				choresList.push(new Chore(row, usersList));
			}));

			console.dir('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
			console.dir(choresList);
			console.dir('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
			console.dir(usersList);
			console.dir('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');

		})
		.catch(reason => {

			console.log(reason);
		});
};
module.exports.getData = getData;
