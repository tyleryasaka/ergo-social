/******************************************************************************\
 * @file api/controllers/controller.argument.js
 * @description argument controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('../lib/lib.js');
var DB = require('../database/connect.js');
var QUERY = require('../database/queries.js');

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
	
	ASYNC.waterfall(
		[
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
						if(data._result.length > 0){
							stmtId = 'statement/' + conclusion._key;
							next(null, argId, stmtId);
						} else {
							next( LIB.errMsg('Statement must be owned to be a conclusion') );
						}
					});
				}
			},
			
			// Connect statement to argument as conclusion
			function(argId, stmtId, next) {
				DB.e.conclusion.save({author: author}, stmtId, argId).then( () => {
					var result = {argument: argId, conclusion: stmtId};
					next(null, result);
				});
			}
		],
		
		function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback( LIB.successMsg(result) );
			}
		}
	
	);
}

/******************************************************************************\
 * @function list
 * @desc lists arguments authored by user
 * @param author => fetch arguments by this user
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.list = function(author, callback) {
	DB.v.argument.byExample({author: author}).then( data => {
		callback( LIB.successMsg(data._result) );
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
		callback( LIB.successMsg(cursor._result[0]) );
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
		callback( LIB.successMsg({}) );
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
				callback( LIB.successMsg({}) );
			});
		}
		
	]);
}
