/******************************************************************************\
 * @file api/controllers/controller.statement.js
 * @description statement controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('../lib/lib.js');
var DB = require('../database/connect.js');
var QUERY = require('../database/queries.js');

/******************************************************************************\
 * @function get
 * @desc get statement details and comments for that statement
 * @param stmtKey => statement identifier
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.get = function(stmtKey, callback) {
	DB.conn.query(
		QUERY.getStatement,
		{
			graphName: DB.graphName,
			stmtId: "statement/" + stmtKey
		}
	).then( cursor => {
		callback( LIB.successMsg(cursor._result[0]) );
	});
}

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
		callback( LIB.successMsg({}) );
	});
}
