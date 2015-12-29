/******************************************************************************\
 * @file api/controllers/controller.premise.js
 * @description premise controller
 * @application ergo
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

exports.create = function(req, res) {
	
	var isNewStatement = req.body.isNewStatement;
	var argId = "argument/" + req.body.argument;
	
	ASYNC.waterfall([
	
		// Create new statement or get the specified id
		function(next) {
			if(isNewStatement) {
				var premise = LIB.filter.statement(req.body, LIB.author);
				DB.v.statement.save(premise)
				.then( result => {
					next(null, result.vertex._id);
				});	
			} else {
				var statementId = 'statement/' + req.body.statement;
				next(null, statementId);
			}
		},
		
		// Connect statement to argument as premise
		function(statementId) {
			DB.e.premise.save({}, statementId, argId).then( result => {
				res.send({
					_id: statementId
				});
			});
		}
		
	]);
}

exports.remove = function(req, res) {
	
	var premiseId = 'statement/' + req.params.premiseKey;
	var argId = 'argument/' + req.params.argKey;
	
	LIB.removePremise(premiseId, argId, LIB.author, () => {
		res.send({
			success: true
		});
	});
	
}
