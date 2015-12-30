/******************************************************************************\
 * @file api/controllers/controller.statement.js
 * @description statement controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

/******************************************************************************\
 * @function remove
 * @desc update an individual statement (could be premise, conclusion, comment,
 * 	or serve multiple purposes)
 * @param key => statement identifier
 * @param statement => new statement object
 * @param author => author of statement
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.update = (key, statement, author, callback) => {
	DB.v.statement.replaceByExample(
		{_key: key, author: author},
		statement
	).then( () => {
		callback( {success: true} );
	});
}
