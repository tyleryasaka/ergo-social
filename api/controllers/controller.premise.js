/******************************************************************************\
 * @file api/controllers/controller.premise.js
 * @description premise controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

exports.create = (premise, callback) => {
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
			DB.e.premise.save({}, stmtId, argId).then( result => {
				callback( {_id: stmtId} );
			});
		}
		
	]);
}

exports.remove = (argKey, premiseKey, author, callback) => {
	var argId = 'argument/' + argKey;
	var premiseId = 'statement/' + premiseKey;
	
	LIB.removePremise(premiseId, argId, author, () => {
		callback( {success: true} );
	});
}
