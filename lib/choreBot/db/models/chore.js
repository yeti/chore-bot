'use strict';

let _ = require('lodash');

let Chore = class Chore {
	constructor(row, usersList) {
		this.name = row.name.trim();
		this.frequency = row.frequency.trim();
		this.reminder = row.reminder;
		let formattedAssigneeNames = Chore.formatAssigneeNames(row.assignees);
		this.assignees = Chore.filterUsersList(usersList, formattedAssigneeNames);
	}

	get overviewMessage() {
		let overviewMessage = `${this.name}: `;
		_.forEach(this.assignees, (assignee) => {
			overviewMessage += `${assignee.username} `;
		});
		return overviewMessage;
	}

	get reminderMessage() {
		return `${this.reminder}`;
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
