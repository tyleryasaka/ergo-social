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
 * @desc add a premise to an argument (using a new or existing statement)
 * @param premise => premise object
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.create = (premise, author, callback) => {
	var argKey = premise.argKey;
	var statement = premise.statement;
	
	ASYNC.waterfall([
	
		// Create new statement or get the specified id
		function(next) {
			if(typeof statement._key == 'undefined') {
				DB.v.statement.save(statement)
				.then( result => {
					next(null, result.vertex._key);
				});	
			} else {
				next(null, statement._key);
			}
		},
		
		// Connect statement to argument as premise
		function(stmtKey) {
			var argId = 'argument/' + argKey;
			var stmtId = 'statement/' + stmtKey;
			DB.e.premise.save({author: author}, stmtId, argId)
			.then( result => {
				callback( {_id: stmtId} );
			});
		}
		
	]);
}

/******************************************************************************\
 * @function remove
 * @desc remove a premise from an argument, and delete the statement if not
 * 	otherwise referenced by the user's arguments
 * @param argKey => argument identifier
 * @param premiseKey => premise statement identifier
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.remove = (argKey, premiseKey, author, callback) => {
	var argId = 'argument/' + argKey;
	var premiseId = 'statement/' + premiseKey;
	
	LIB.removeEdge('premise', premiseId, argId, author, () => {
		callback( {success: true} );
	});
}
