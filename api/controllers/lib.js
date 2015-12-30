/******************************************************************************\
 * @file api/controllers/lib.js
 * @description resuable data/functions for controllers
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var DB = require('../database/index.js');
var QUERY = require('../queries/index.js');

//temporary
exports.author = 'tyler';

/******************************************************************************\
 * @function removePremise
 * @desc removes a premise from an argument; deletes statement only if
 * 	it is not connected to any other arguments by that user
 * @param premiseId => premise to remove
 * @param argId => argument to remove from
 * @param authorId => author of argument
 * @param callback => function to call (without parameters) when done
\******************************************************************************/

// ownership security!

exports.removePremise = function(premiseId, argId, authorId, callback) {
	
	ASYNC.waterfall([
	
		// First remove the connection between the premise statement and the argument
		function(next) {
			DB.e.premise.removeByExample({_from:premiseId, _to: argId})
			.then( cursor => {
				next(null);
			});
		},
		
		// Then check if this statement is the conclusion for any other arguments
		function(next) {
			DB.conn.query(
				QUERY.isOrphaned,
				{
					graphName: DB.graphName,
					stmtId: premiseId,
					authorId: authorId
				}
			).then( cursor => {
				next(null, cursor._result[0]);
			});
		},
		
		// If the statement is "orphaned", we should remove it
		// Orphaned statements are statements not connected to an
		// argument owned by the user
		function(isOrphaned) {
			if(isOrphaned) {
				DB.v.statement.remove(premiseId)
				.then( cursor => {
					callback();
				});
			} else {
				callback();
			}
		}
	
	]);
}


/******************************************************************************\
 * @function removeConclusion
 * @desc removes a conclusion from an argument; deletes statement only
 * 	if it is not connected to any other arguments by that user
 * @param conclusionId => conclusion to remove
 * @param argId => argument to remove from
 * @param authorId => author of argument
 * @param callback => function to call (without parameters) when done
 \******************************************************************************/
 
// ownsership security!
 
exports.removeConclusion = function(conclusionId, argId, authorId, callback) {
	
	ASYNC.waterfall([
	
		function(next) {
			// First remove the connection between the premise statement and the argument
			DB.e.conclusion.removeByExample({_from:argId, _to:conclusionId})
			.then( cursor => {
				next(null);
			});
		},
		
		// Then check if this statement is the conclusion for any other arguments
		function(next) {
			DB.conn.query(
				QUERY.isOrphaned,
				{
					graphName: DB.graphName,
					stmtId: conclusionId,
					authorId: authorId
				}
			).then( cursor => {
				next(null, cursor._result[0]);
			});
		},
		
		// If the statement is "orphaned", we should remove it
		// Orphaned statements are statements not connected to an
		// argument owned by the user
		function(isOrphaned) {
			if(isOrphaned) {
				DB.v.statement.remove(conclusionId)
				.then( cursor => {
					callback();
				});
			}  else {
				callback();
			}
		}
	
	]);
}
