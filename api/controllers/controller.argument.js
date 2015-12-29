/******************************************************************************\
 * @file api/controllers/controller.argument.js
 * @description argument controller
 * @application ergo
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');
var QUERY = require('../queries/index.js');

exports.create = function(req, res) {
	
	var argument = LIB.filter.argument(req.body.argument, LIB.author);
	var isNewConclusion = req.body.isNewConclusion;
	
	ASYNC.waterfall([
	
		// Create argument
		function(next) {
			DB.v.argument.save(argument).then( result => {
				next(null, result.vertex._id);
			});
		},
		
		// Create conclusion statement or use existing one
		function(argId, next) {
			if(isNewConclusion) {
				var conclusion = LIB.filter.statement(req.body.conclusion, LIB.author);
				DB.v.statement.save(conclusion).then( result => {
					next(null, argId, result.vertex._id);
				});
			} else {
				var conclusionId = 'statement/' + req.body.conclusion;
				next(null, argId, conclusionId);
			}
		},
		
		// Connect statement to argument as conclusion
		function(argId, stmtId) {
			DB.e.conclusion.save({}, argId, stmtId).then( () => {
				res.send({
					argument: argId,
					conclusion: stmtId
				});
			});
		}
	
	]);
	
}

exports.list = function(req, res) {
	DB.v.argument.all().then( data => {
		res.send(data._result);
	});
}

exports.get = function(req, res) {
	
	var key = req.params.key;

	DB.conn.query(
		QUERY.getArgument,
		{
			graphName: DB.graphName,
			argId: "argument/" + key
		}
	).then( cursor => {
		res.send(cursor._result[0]);
	});
	
}

exports.update = function(req, res) {
	
	var key = req.params.key;
	var argument = LIB.filter.argument(req.body, LIB.author);
	
	DB.v.argument.replace(key, argument).then( ()=> {
		res.send({
			success: true
		});
	});
	
}

exports.remove = function(req, res) {
	
	var argId = 'argument/' + req.params.key;
	
	ASYNC.waterfall([

		// First get the premises of this argument
		function(next) {
			DB.conn.query(
				QUERY.getPremisesForArgument,
				{graphName:DB.graphName, argId:argId}
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
						LIB.removePremise(premiseId, argId, LIB.author, callback);
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
			LIB.removeConclusion(conclusionId, argId, LIB.author, next);
		},
		
		// Finally we can delete the argument
		function() {
			DB.v.argument.remove(argId).then( () => {
				res.send({
					success: true
				});
			});
		}
	
	]);
	
}
