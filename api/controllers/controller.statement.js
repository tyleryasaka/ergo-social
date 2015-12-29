/******************************************************************************\
 * @file api/controllers/controller.statement.js
 * @description statement controller
 * @application ergo
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('./lib.js');
var DB = require('../database/index.js');

exports.update = function(req, res) {
	
	var key = req.params.key;
	var statement = LIB.filter.statement(req.body, LIB.author);
	
	DB.v.statement.replace(key, statement)
	.then( () => {
		res.send({
			success: true
		});
	});
	
}
