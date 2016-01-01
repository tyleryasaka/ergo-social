/******************************************************************************\
 * @file api/controllers/lib.js
 * @description resuable data/functions for controllers
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var CRYPTO = require('crypto');
var DB = require('../database/index.js');
var QUERY = require('../queries/index.js');

/******************************************************************************\
 * @function removeEdge
 * @desc removes an edge between 2 specified vertices; then it removes the
 * 	"from" vertex if it is "orphaned" (i.e. not connected
 * @param from => the "from" vertex of the edge
 * @param to => the "to" vertex of the edge
 * @param author => author of argument (identifier)
 * @param callback => function to call (without parameters) when done
\******************************************************************************/
exports.removeEdge = function(edgeType, from, to, author, callback) {
	
	ASYNC.waterfall([
	
		function(next) {
			// First remove the connection between the premise statement and the argument
			DB.e[edgeType].removeByExample(
				{_from: from, _to: to, author: author}
			).then( cursor => {
				next(null);
			});
		},
		
		// Then check if this statement is the conclusion for any other arguments
		function(next) {
			DB.conn.query(
				QUERY.isOrphaned,
				{graphName: DB.graphName, stmtId: from, authorId: author}
			).then( cursor => {
				next(null, cursor._result[0]);
			});
		},
		
		// If the statement is "orphaned", we should remove it
		// Orphaned statements are statements not connected to an
		// argument owned by the user
		function(isOrphaned) {
			if(isOrphaned) {
				DB.v.statement.removeByExample(
					{_id: from, author: author}
				).then( cursor => {
					callback();
				});
			}  else {
				callback();
			}
		}
	
	]);
}

/******************************************************************************\
 * @function encrypt
 * @desc encrypts a string with md5
 * @param str => string to encrypt
 * @return encrypted string
\******************************************************************************/
exports.encrypt = function(str){
	return CRYPTO.createHash('md5').update(str).digest('hex');
}

/******************************************************************************\
 * @function errMsg
 * @desc format an error message
 * @param message => the error message (string or object)
 * @return formatted message
\******************************************************************************/
exports.errMsg = function(message) {
	return {status: 'error', message: message};
}

/******************************************************************************\
 * @function successMsg
 * @desc format a success message
 * @param data => the data to return (string or object)
 * @return formatted message
\******************************************************************************/
exports.successMsg = function(data) {
	return {status: 'success', data: data};
}
