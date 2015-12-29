/*
 * @file: api.js
 * 
 * @application: ergo
 * @author: Tyler Yasaka 
 */

/*--------------------------------------*\
 * Configuration options
\*--------------------------------------*/

//port to serve the api
var PORT = 8080;

//from the express-session docs: 'used to sign the session ID cookie';
var SESSION_SECRET = 'test123';

var DBNAME = "ergo";
var GRAPH_NAME = "ergoGraph";

//temporary
var author = 'tyler';


/*--------------------------------------*\
 *	Node modules												*
\*--------------------------------------*/

var MOD = {};

MOD.arangojs = require('arangojs');
MOD.async = require('async');
MOD.bodyParser = require('body-parser');
MOD.express = require('express');
MOD.expressSession = require('express-session');


/*--------------------------------------*\
 *	Custom modules											*
\*--------------------------------------*/

MOD.queries = require('./includes/queries.js');
MOD.models = require('./includes/models.js');


/*--------------------------------------*\
 *	Setup database											*
\*--------------------------------------*/

//object to store everything related to the database
var ARANGO = {};

//arangodb is our database object
ARANGO.db = MOD.arangojs();

ARANGO.db.useDatabase(DBNAME);

//graph object
ARANGO.graph = ARANGO.db.graph(GRAPH_NAME);

//object to hold vertex collections
var VERTEX = {
	statement: ARANGO.graph.vertexCollection('statement'),
	argument: ARANGO.graph.vertexCollection('argument'),
	user: ARANGO.graph.vertexCollection('user')
}

//object to hold edge collections
var EDGE = {
	premise: ARANGO.graph.edgeCollection('premise'),
	conclusion: ARANGO.graph.edgeCollection('conclusion'),
	comment: ARANGO.graph.edgeCollection('comment'),
	author: ARANGO.graph.edgeCollection('author')
}


/*--------------------------------------*\
 *	Initializing app										*
\*--------------------------------------*/

var APP = MOD.express();

//parse json post data
APP.use(MOD.bodyParser.json());

//initialize session
APP.use(MOD.expressSession({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

APP.use(MOD.express.static(__dirname + '/../public'));

//Begin listening for requests
var SERVER = APP.listen(PORT, () => {
	var host = SERVER.address().address;
	var port = SERVER.address().port;
	console.log('ergo listening on ' + host + ':' + port);
});
	
	
/*------------------------------*\
 *	API													*
\*------------------------------*/

APP.post('/0.0/argument', (req, res) => {
	
	var argument = MOD.models.argument(req.body.argument, author);
	var isNewConclusion = req.body.isNewConclusion;
	
	MOD.async.waterfall([
	
		//Create argument
		function(next) {
			VERTEX.argument.save(argument).then( result => {
				next(null, result.vertex._id);
			});
		},
		
		//Create conclusion statement or use existing one
		function(argId, next) {
			if(isNewConclusion) {
				var conclusion = MOD.models.statement(req.body.conclusion, author);
				VERTEX.statement.save(conclusion).then( result => {
					next(null, argId, result.vertex._id);
				});
			} else {
				var conclusionId = 'statement/' + req.body.conclusion;
				next(null, argId, conclusionId);
			}
		},
		
		//Connect statement to argument as conclusion
		function(argId, stmtId) {
			EDGE.conclusion.save({}, argId, stmtId).then( () => {
				res.send({
					argument: argId,
					conclusion: stmtId
				});
			});
		}
	
	]);
	
});

APP.get('/0.0/argument', (req, res) => {
	VERTEX.argument.all().then( data => {
		res.send(data._result);
	});
});

APP.get('/0.0/argument/:key', (req, res) => {
	
	var key = req.params.key;

	ARANGO.db.query(
		MOD.queries.getArgument,
		{
			graphName: GRAPH_NAME,
			argId: "argument/"+key
		}
	).then( cursor => {
		res.send(cursor._result[0]);
	});
	
});

APP.put('/0.0/argument/:key', (req, res) => {
	
	var key = req.params.key;
	var argument = MOD.models.argument(req.body, author);
	
	VERTEX.argument.replace(key, argument).then( ()=> {
		res.send({
			success: true
		});
	});
	
});

APP.delete('/0.0/argument/:key', (req, res) => {
	
	var argId = 'argument/'+req.params.key;
	
	MOD.async.waterfall([

		//First get the premises of this argument
		function(next) {
			ARANGO.db.query(
				MOD.queries.getPremisesForArgument,
				{graphName:GRAPH_NAME, argId:argId}
			).then( cursor => {
				next(null, cursor._result);
			});
		},
		
		//Then delete all of them
		function(premises, next) {
			if(premises.length > 0) {
				MOD.async.each(
					premises,
					function(premiseId, callback){
						removePremise(premiseId, argId, author, callback);
					},
					function(){
						next(null);
					}
				);
			} else {
				next(null);
			}
		},
		
		//Now get the conclusion of this argument
		function(next) {
			ARANGO.db.query(
				MOD.queries.getConclusionForArgument,
				{
					graphName: GRAPH_NAME,
					argId: argId
				}
			).then( cursor => {
				next(null, cursor._result[0]);
			});
		},
		
		//And delete it as well
		function(conclusionId, next) {
			removeConclusion(conclusionId, argId, author, next);
		},
		
		//Finally we can delete the argument
		function() {
			VERTEX.argument.remove(argId).then( () => {
				res.send({
					success: true
				});
			});
		}
	
	]);
	
});

APP.get('/0.0/profile', (req, res) => {
	//for now just return atomic arguments
});

APP.put('/0.0/statement/:key', (req, res) => {
	
	var key = req.params.key;
	var statement = MOD.models.statement(req.body, author);
	
	VERTEX.statement.replace(key, statement)
	.then( () => {
		res.send({
			success: true
		});
	});
	
});

APP.post('/0.0/premise', (req, res) => {
	
	var isNewStatement = req.body.isNewStatement;
	var argId = "argument/"+req.body.argument;
	
	MOD.async.waterfall([
	
		//Create new statement or get the specified id
		function(next) {
			if(isNewStatement) {
				var premise = MOD.models.statement(req.body, author);
				VERTEX.statement.save(premise)
				.then( result => {
					next(null, result.vertex._id);
				});	
			} else {
				var statementId = 'statement/' + req.body.statement;
				next(null, statementId);
			}
		},
		
		//Connect statement to argument as premise
		function(statementId) {
			EDGE.premise.save({}, statementId, argId).then( result => {
				res.send({
					_id: statementId
				});
			});
		}
		
	]);
});

APP.delete('/0.0/premise/:argKey/:premiseKey', (req, res) => {
	
	var premiseId = 'statement/'+req.params.premiseKey;
	var argId = 'argument/'+req.params.argKey;
	
	removePremise(premiseId, argId, author, () => {
		res.send({
			success: true
		});
	});
	
});

/*------------------------------*\
 *	Global functions						*
\*------------------------------*/

/*
 * @function removePremise
 * 
 * @desc removes a premise from an argument; deletes statement only if
 * 	it is not connected to any other arguments by that user
 * @param premiseId: premise to remove
 * @param argId: argument to remove from
 * @param authorId: author of argument
 * @param callback: function to call (without parameters) when done
 */
var removePremise = function(premiseId, argId, authorId, callback) {
	
	MOD.async.waterfall([
	
		// First remove the connection between the premise statement and the argument
		function(next) {
			EDGE.premise.removeByExample({_from:premiseId, _to: argId})
			.then( cursor => {
				next(null);
			});
		},
		
		// Then check if this statement is the conclusion for any other arguments
		function(next) {
			ARANGO.db.query(
				MOD.queries.isOrphaned,
				{
					graphName: GRAPH_NAME,
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
				VERTEX.statement.remove(premiseId)
				.then( cursor => {
					callback();
				});
			} else {
				callback();
			}
		}
	
	]);
}

/*
 * @function removeConclusion
 * 
 * @desc removes a conclusion from an argument; deletes statement only
 * 	if it is not connected to any other arguments by that user
 * @param conclusionId: conclusion to remove
 * @param argId: argument to remove from
 * @param authorId: author of argument
 * @param callback: function to call (without parameters) when done
 */
var removeConclusion = function(conclusionId, argId, authorId, callback) {
	
	MOD.async.waterfall([
	
		function(next) {
			//First remove the connection between the premise statement and the argument
			EDGE.conclusion.removeByExample({_from:argId, _to:conclusionId})
			.then( cursor => {
				next(null);
			});
		},
		
		//Then check if this statement is the conclusion for any other arguments
		function(next) {
			ARANGO.db.query(
				MOD.queries.isOrphaned,
				{
					graphName: GRAPH_NAME,
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
				VERTEX.statement.remove(conclusionId)
				.then( cursor => {
					callback();
				});
			}  else {
				callback();
			}
		}
	
	]);
}

