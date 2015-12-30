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
 * @param req => premise to remove
 * @param argId => argument to remove from
 * @param authorId => author of argument
 * @param callback => function to call (without parameters) when done
\******************************************************************************/
exports.create = function(argument, conclusion, callback) {
	
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
				var stmtId = 'statement/' + conclusion._key;
				next(null, argId, stmtId);
			}
		},
		
		// Connect statement to argument as conclusion
		function(argId, stmtId) {
			DB.e.conclusion.save({}, argId, stmtId).then( () => {
				var result = {argument:argId, conclusion:stmtId};
				callback(result);
			});
		}
	
	]);
}

exports.list = function(callback) {
	DB.v.argument.all().then( data => {
		callback(data._result);
	});
}

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

// Needs to check for ownership of argument!
exports.update = function(key, argument, callback) {
	DB.v.argument.replace(key, argument).then( ()=> {
		callback( {success:true} );
	});
}

// Needs to check for ownership of argument!
exports.remove = function(argKey, author,callback) {
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
						LIB.removePremise(premiseId, argId, author, callback);
					},
					function(){
						next(null);
					}
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
			LIB.removeConclusion(conclusionId, argId, author, next);
		},
		
		// Finally we can delete the argument
		function() {
			DB.v.argument.remove(argId).then( () => {
				callback( {success:true} );
			});
		}
		
	]);
}
