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

app.post('/0.0/argument', (req,res)=> {
	
	var title = req.body.title;
	var isDeductive = req.body.isDeductive;
	var premises = req.body.premises;
	var conclusion = req.body.conclusion;
	
	var emitter = newEmitter();
	
	var argument = {
		title: title,
		isDeductive: isDeductive,
		isAtomic: false
	}
	
	vertex.argument.save(argument).then( result => {
		emitter.emit('saveArg', result.vertex);
	});
	
	/*emitter.on('saveArg', argId => {
		mod.async.map(
			premises,
			function(premise,callback){
				vertex.statement.save({content: premise}).then( result => {
					callback(null, result.vertex._id);
				});
			},
			function(err, stmtIds) {
				emitter.emit('savePremises', argId, stmtIds);
			}
		);
	});
	
	emitter.on('savePremises', (argId, stmtIds) => {
		mod.async.each(
			stmtIds,
			function(stmtId, callback){
				edge.premise.save({}, stmtId, argId).then( () => {
					callback();
				});
			},
			function(err) {
				emitter.emit('connectPremises', argId);
			}
		);
	});*/
	
	emitter.on('saveArg', arg => {
		vertex.statement.save({content: conclusion}).then( result => {
			emitter.emit('saveConclusion', arg, result.vertex);
		});
	});
	
	emitter.on('saveConclusion', (arg, conclusion) => {
		edge.conclusion.save({}, argId, stmtId).then( () => {
			res.send({
				argument: arg,
				conclusion: conclusion
			});
		});
	});
	
});

app.get('/0.0/argument', (req,res)=> {
	vertex.argument.all().then( data => {
		res.send(data._result);
	});
});

app.get('/0.0/argument/:key', (req,res)=> {
	
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

app.put('/0.0/argument/:key', (req,res)=> {
	
	var key = req.params.key;

	/*arango.db.query(
		mod.queries.getArgument,
		{
			graphName: graphName,
			argId: "argument/"+key
		}
	).then( cursor => {
		res.send(cursor._result[0]);
	});*/
	
});

app.delete('/0.0/argument/:key', (req,res)=> {
	
	var key = req.params.key;

	/*arango.db.query(
		mod.queries.getArgument,
		{
			graphName: graphName,
			argId: "argument/"+key
		}
	).then( cursor => {
		res.send(cursor._result[0]);
	});*/
	
});

app.get('/0.0/profile', (req,res)=> {
	//for now just return atomic arguments
});

app.put('/0.0/statement/:key', (req,res)=> {
	
	var key = req.params.key;
	
});

app.post('/0.0/premise', (req,res)=> {
	
	var content = req.body.content;
	var argId = req.body.argument;
	
	var emitter = newEmitter();
	
	
	
});

app.delete('/0.0/premise/:key', (req,res)=> {
	
	var key = req.params.key;
	
	//delete edge, and statement if it is not a conclusion
	
});

/*------------------------------*\
 *	Global functions						*
\*------------------------------*/
var newEmitter = function() {
	return new mod.events.EventEmitter();
}
