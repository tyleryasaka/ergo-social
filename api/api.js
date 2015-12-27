/*-------------------------------------------------------------*\
|																																|
|	Application:	ergo																						|
|	Filename:			api.js																					|
|	Authors:			Tyler Yasaka																		|
|																																|
\*-------------------------------------------------------------*/


/*--------------------------------------*\
 *	Configuration options								*
\*--------------------------------------*/

//port to serve the api
var port = 8080;

//from the express-session docs: 'used to sign the session ID cookie';
var sessionSecret = '8029df8b';

var dbName = "ergo";
var graphName = "ergoGraph";

//temporary
var author = 'tyler';


/*--------------------------------------*\
 *	Node modules												*
\*--------------------------------------*/

var mod = {};

mod.arangojs = require('arangojs');
mod.async = require('async');
mod.bodyParser = require('body-parser');
mod.events = require('events');
mod.express = require('express');
mod.expressSession = require('express-session');


/*--------------------------------------*\
 *	Custom modules											*
\*--------------------------------------*/

mod.queries = require('./includes/queries.js');
mod.models = require('./includes/models.js');


/*--------------------------------------*\
 *	Setup database											*
\*--------------------------------------*/

//object to store everything related to the database
var arango = {};

//arangodb is our database object
arango.db = mod.arangojs();

arango.db.useDatabase(dbName);

//graph object
arango.graph = arango.db.graph(graphName);

//object to hold vertex collections
vertex = {
	statement: arango.graph.vertexCollection('statement'),
	argument: arango.graph.vertexCollection('argument'),
	user: arango.graph.vertexCollection('user')
}

//object to hold edge collections
edge = {
	premise: arango.graph.edgeCollection('premise'),
	conclusion: arango.graph.edgeCollection('conclusion'),
	comment: arango.graph.edgeCollection('comment'),
	author: arango.graph.edgeCollection('author')
}


/*--------------------------------------*\
 *	Initializing app										*
\*--------------------------------------*/

var app = mod.express();

//parse json post data
app.use(mod.bodyParser.json());

//initialize session
app.use(mod.expressSession({
	secret:sessionSecret,
	resave:false,
	saveUninitialized:false
}));

app.use(mod.express.static(__dirname + '../public'));

//Begin listening for requests
var server = app.listen(port, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('ergo listening on '+host+':'+port);
});
	
	
/*------------------------------*\
 *	API													*
\*------------------------------*/

app.post('/0.0/argument', (req, res)=> {
	
	var argument = mod.models.argument(req.body.argument, author);
	var conclusion = mod.models.statement(req.body.conclusion, author);
	
	var emitter = newEmitter();
	
	//Create argument
	vertex.argument.save(argument).then( result => {
		emitter.emit('createArg', result.vertex);
	});
	
	//Create statement
	emitter.on('createArg', arg => {
		vertex.statement.save(conclusion).then( result => {
			emitter.emit('createStmt', arg, result.vertex);
		});
	});
	
	//Connect statement to argument as conclusion
	emitter.on('createStmt', (arg, stmt) => {
		edge.conclusion.save({}, arg._id, stmt._id).then( () => {
			res.send({
				argument: arg,
				conclusion: stmt
			});
		});
	});
	
});

app.get('/0.0/argument', (req, res)=> {
	vertex.argument.all().then( data => {
		res.send(data._result);
	});
});

app.get('/0.0/argument/:key', (req, res)=> {
	
	var key = req.params.key;

	arango.db.query(
		mod.queries.getArgument,
		{
			graphName: graphName,
			argId: "argument/"+key
		}
	).then( cursor => {
		res.send(cursor._result[0]);
	});
	
});

app.put('/0.0/argument/:key', (req, res)=> {
	
	var key = req.params.key;
	var argument = mod.models.argument(req.body, author);
	
	vertex.argument.replace(key, argument)
	.then( ()=> {
		res.send({
			success: true
		});
	});
	
});

app.delete('/0.0/argument/:key', (req, res)=> {
	
	var argId = 'argument/'+req.params.key;
	
	var emitter = newEmitter();

	//First get the premises of this argument
	arango.db.query(
		mod.queries.getPremisesForArgument,
		{
			graphName: graphName,
			argId: argId
		}
	).then( cursor => {
		emitter.emit('gotPremises', cursor._result);
	});
	
	//Then delete all of them
	emitter.on('gotPremises', premises => {
		if(premises.length > 0){
			mod.async.each(
				premises,
				function(premiseId, callback){
					var premiseEmitter = newEmitter();
					removePremise(premiseId, argId, author, premiseEmitter);
					premiseEmitter.on('removedPremise', callback);
				},
				function(){
					emitter.emit('removedPremises');
				}
			);
		}
		else{
			emitter.emit('removedPremises');
		}
	});
	
	//Now get the conclusion of this argument
	emitter.on('removedPremises', () => {
		arango.db.query(
			mod.queries.getConclusionForArgument,
			{
				graphName: graphName,
				argId: argId
			}
		).then( cursor => {
			emitter.emit('gotConclusion', cursor._result[0]);
		});
	});
	
	//And delete it as well
	emitter.on('gotConclusion', conclusionId => {
		removeConclusion(conclusionId, argId, author, emitter);
	});
	
	//Finally we can delete the argument
	emitter.on('removedConclusion', () => {
		vertex.argument.remove(argId).then( () => {
			res.send({
				success: true
			});
		});
	});
	
});

app.get('/0.0/profile', (req, res)=> {
	//for now just return atomic arguments
});

app.put('/0.0/statement/:key', (req, res)=> {
	
	var key = req.params.key;
	var statement = mod.models.statement(req.body, author);
	
	vertex.statement.replace(key, statement)
	.then( ()=> {
		res.send({
			success: true
		});
	});
	
});

app.post('/0.0/premise', (req, res)=> {
	
	var argId = "argument/"+req.body.argument;
	var premise = mod.models.statement(req.body, author);
	
	var emitter = newEmitter();
	
	//Create statement
	vertex.statement.save(premise)
	.then( result => {
		emitter.emit('createStmt', result.vertex);
	});
	
	//Connect to argument as premise
	emitter.on('createStmt', stmt => {
		edge.premise.save({}, stmt._id, argId).then( () => {
			res.send({
				premise: stmt
			});
		});
	});
	
});

app.delete('/0.0/premise/:argKey/:premiseKey', (req, res)=> {
	
	var premiseId = 'statement/'+req.params.premiseKey;
	var argId = 'argument/'+req.params.argKey;
	
	var emitter = newEmitter();
	
	removePremise(premiseId, argId, author, emitter);
	
	emitter.on('removedPremise', () => {
		res.send({
			success: true
		});
	});
	
});

/*------------------------------*\
 *	Global functions						*
\*------------------------------*/
var newEmitter = function() {
	return new mod.events.EventEmitter();
}

var removePremise = function(premiseId, argId, authorId, emitter){
	//First remove the connection between the premise statement and the argument
	edge.premise.removeByExample(
		{
			_from: premiseId,
			_to: argId
		}
	).then( cursor => {
		emitter.emit('removedPremiseFromArgument');
	});
	
	//Then check if this statement is the conclusion for any other arguments
	emitter.on('removedPremiseFromArgument', () => {
		arango.db.query(
			mod.queries.isConclusion,
			{
				graphName: graphName,
				stmtId: premiseId,
				authorId: authorId
			}
		).then( cursor => {
			emitter.emit('checkedIfConclusion', cursor._result[0]);
		});
	});
	
	//If the statement is not a conclusion, we should remove it
	emitter.on('checkedIfConclusion', isConclusion => {
		if(!isConclusion){
			vertex.statement.remove(premiseId)
			.then( cursor => {
				emitter.emit('removedPremise');
			});
		}
		else{
			emitter.emit('removedPremise');
		}
	});
}

var removeConclusion = function(conclusionId, argId, authorId, emitter){
	//First remove the connection between the premise statement and the argument
	edge.conclusion.removeByExample(
		{
			_from: argId,
			_to: conclusionId
		}
	).then( cursor => {
		emitter.emit('removedConclusionFromArgument');
	});
	
	//Then check if this statement is the conclusion for any other arguments
	emitter.on('removedConclusionFromArgument', () => {
		arango.db.query(
			mod.queries.isPremise,
			{
				graphName: graphName,
				stmtId: conclusionId,
				authorId: authorId
			}
		).then( cursor => {
			emitter.emit('checkedIfPremise', cursor._result[0]);
		});
	});
	
	//If the statement is not a conclusion, we should remove it
	emitter.on('checkedIfPremise', isPremise => {
		if(!isPremise){
			vertex.statement.remove(conclusionId)
			.then( cursor => {
				emitter.emit('removedConclusion');
			});
		}
		else{
			emitter.emit('removedConclusion');
		}
	});
}

