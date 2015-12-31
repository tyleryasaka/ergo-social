/******************************************************************************\
 * @file api/controllers/controller.premise.js
 * @description premise controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

/******************************************************************************\
 * @function create
 * @desc add a comment to an argument (using a new or existing statement)
 * @param statement => statement object
 * @param subjectId => subject of comment (identifier)
 * @param author => author of comment
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.create = (statement, subjectId, author, callback) => {
	ASYNC.waterfall([
	
		// Create new statement or get the specified id
		function(next) {
			DB.v.statement.save(statement)
			.then( result => {
				next(null, result.vertex._id);
			});	
		},
		
		// Connect statement to argument as premise
		function(stmtId) {
			DB.e.comment.save({author: author}, stmtId, subjectId)
			.then( result => {
				callback( {_id: stmtId} );
			});
		}
		
	]);
}

/******************************************************************************\
 * @function list
 * @desc lists comments authored by user
 * @param author => fetch arguments by this user
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.list = function(author, callback) {
	DB.e.comment.byExample({author: author}).then( data => {
		callback(data._result);
	});
}

/******************************************************************************\
 * @function remove
 * @desc remove a premise from an argument, and delete the statement if not
 * 	otherwise referenced by the user's arguments
 * @param subjectId => subject of comment (identifier)
 * @param commentKey => comment statement identifier
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.remove = (subjectId, commentKey, author, callback) => {
	var commentId = 'statement/' + commentKey;
	
	LIB.removeEdge('comment', commentId, subjectId, author, () => {
		callback( {success: true} );
	});
}
