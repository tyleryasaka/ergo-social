/******************************************************************************\
 * @file api/controllers/controller.statement.js
 * @description statement controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

// Needs to check for ownership of argument!
exports.update = (key, statement, callback) => {
	DB.v.statement.replace(key, statement)
	.then( () => {
		callback( {success: true} );
	});
}
