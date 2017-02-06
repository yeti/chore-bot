'use strict';

// Modules
let GoogleSpreadsheet = require('google-spreadsheet');
let Chore = require('./models/chore');
let User = require('./models/user');
let config = require('../../../config.js');
let _ = require('lodash');


let getRowsFromSheet = function(sheetKey, orderby) {
	// Spin up promise
	let promise = new Promise(function(resolve, reject) {

		// Init
		let doc = new GoogleSpreadsheet(sheetKey);
		let sheet;

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

let mapData = function(userRows, choreRows) {
	let choresList = [];
	let usersList = [];

	_.map(userRows, (row => {
		usersList.push(new User(row));
	}));

	_.map(choreRows, (row => {
		choresList.push(new Chore(row, usersList));
	}));

	return {
		usersList: usersList,
		choresList: choresList
	};
};

let getData = function() {
	return Promise.all([getUsers(), getChores()])
		.then(values => {
			return (mapData(values[0], values[1]));
		})
		.catch(reason => {
			console.log(reason);
		});
};
module.exports.getData = getData;
