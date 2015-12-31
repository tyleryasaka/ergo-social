/******************************************************************************\
 * @file api/controllers/controller.argument.js
 * @description argument controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');
var QUERY = require('../queries/index.js');

/******************************************************************************\
 * @function create
 * @desc creates an argument vertex, a statement vertex, and a conclusion edge
 * 	between the argument and the statement
 * @param argument => argument object
 * @param conclusion => conclusion statement object
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.create = function(argument, conclusion, author, callback) {
	
	ASYNC.waterfall([
	
		// Create argument
		function(next) {
			DB.v.argument.save(argument).then( result => {
				next(null, result.vertex._id);
			});
		},
		
		// Create conclusion statement or use existing one
		function(argId, next) {
			if(typeof conclusion._key == 'undefined') {
				DB.v.statement.save(conclusion).then( result => {
					next(null, argId, result.vertex._id);
				});
			} else {
				//ensure the conclusion is owned by this user
				DB.v.statement.byExample(
					{_key: conclusion._key, author: author}
				).then( data => {
					var stmtId = null;
					if(data._result.length > 0){
						stmtId = 'statement/' + conclusion._key;
					}
					next(null, argId, stmtId);
				});
			}
		},
		
		// Connect statement to argument as conclusion
		function(argId, stmtId) {
			if(stmtId) {
				DB.e.conclusion.save({author: author}, stmtId, argId).then( () => {
					var result = {argument: argId, conclusion: stmtId};
					callback(result);
				});
			}	else {
				callback( {success: false} );
			}
		}
	
	]);
}

/******************************************************************************\
 * @function list
 * @desc lists arguments authored by user
 * @param author => fetch arguments by this user
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.list = function(author, callback) {
	DB.v.argument.byExample({author: author}).then( data => {
		callback(data._result);
	});
}

/******************************************************************************\
 * @function get
 * @desc get details of a specific argument
 * @param key => identifier of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.get = function(key, callback) {
	DB.conn.query(
		QUERY.getArgument,
		{
			graphName: DB.graphName,
			argId: "argument/" + key
		}
	).then( cursor => {
		callback(cursor._result[0]);
	});
}

/******************************************************************************\
 * @function update
 * @desc modify the metadata of an argument
 * @param key => identifier of argument
 * @param argument => argument object
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.update = function(key, argument, author, callback) {
	DB.v.argument.replaceByExample(
		{_key: key, author: author},
		argument
	).then( ()=> {
		callback( {success: true} );
	});
}

/******************************************************************************\
 * @function remove
 * @desc remove an argument (and associated premises/conclusion not otherwised 
 * 	referenced by arguments of the owner)
 * @param argKey => argument identifier
 * @param author => author of argument
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.remove = function(argKey, author, callback) {
	var argId = 'argument/' + argKey;
	
	ASYNC.waterfall([
	
		// First get the premises of this argument
		function(next) {
			DB.conn.query(
				QUERY.getPremisesForArgument,
				{
					graphName: DB.graphName,
					argId: argId
				}
			).then( cursor => {
				next(null, cursor._result);
			});
		},
		
		// Then delete all of them
		function(premises, next) {
			if(premises.length > 0) {
				ASYNC.each(
					premises,
					function(premiseId, callback){
						LIB.removeEdge('premise', premiseId, argId, author, callback);
					},
					next
				);
			} else {
				next(null);
			}
		},
		
		// Now get the conclusion of this argument
		function(next) {
			DB.conn.query(
				QUERY.getConclusionForArgument,
				{
					graphName: DB.graphName,
					argId: argId
				}
			).then( cursor => {
				next(null, cursor._result[0]);
			});
		},
		
		// And delete it as well
		function(conclusionId, next) {
			LIB.removeEdge('conclusion', conclusionId, argId, author, next);
		},
		
		// Finally we can delete the argument
		function() {
			DB.v.argument.removeByExample(
				{_id: argId, author: author}
			).then( () => {
				callback( {success: true} );
			});
		}
		
	]);
}
