'use strict';

let _ = require('lodash');

let Chore = class Chore {
	constructor(row, usersList) {
		this.name = row.name.trim();
		this.frequency = row.frequency.trim();
		this.formattedAssigneeNames = Chore.formatAssigneeNames(row.assignees);
		this.assignees = Chore.filterUsersList(usersList, this.formattedAssigneeNames);
	}

	// Split and trim all comma separated names
	static formatAssigneeNames(assignees) {
		let formattedAssigneeNames = [];
		_.forEach(assignees.split(','), function(unformattedName) {
			formattedAssigneeNames.push(unformattedName.trim());
		});
		return formattedAssigneeNames;
	}

	// Filter list of users if their name shows up in assignees list
	static filterUsersList(usersList, formattedAssigneeNames) {
		return _.filter(usersList, function(user) {
			return _.includes(formattedAssigneeNames, user.name);
		});
	}
};
module.exports = Chore;
