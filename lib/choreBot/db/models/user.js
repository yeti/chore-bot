'use strict';

let User = class User {
	constructor(row) {
		this.name = row.name.trim();
		this.username = row.username.trim();
		this.isAdmin = row.isadmin === 'TRUE';
	}
};
module.exports = User;
