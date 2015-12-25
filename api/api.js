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

var modules = {};

modules.arangojs = require('arangojs');
modules.async = require('async');
modules.bodyParser = require('body-parser');
modules.events = require('events');
modules.express = require('express');
modules.expressSession = require('express-session');


/*--------------------------------------*\
 *	Setup database											*
\*--------------------------------------*/

//object to store everything related to the database
var arango = {};

//arangodb is our database object
arango.db = modules.arangojs();

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

var app = modules.express();

//parse json post data
app.use(modules.bodyParser.json());

//initialize session
app.use(modules.expressSession({
	secret:sessionSecret,
	resave:false,
	saveUninitialized:false
}));

app.use(modules.express.static(__dirname + '../public'));

//Begin listening for requests
var server = app.listen(port, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('ergo listening on '+host+':'+port);
});
	
	
/*------------------------------*\
 *	API													*
\*------------------------------*/

/*--------------------------------*\
	* @desc creates an argument
	* @input object data
	* @output object response
\*--------------------------------*/
app.post('/0.0/argument', (req,res)=> {
	var emitter = newEmitter();
	
	var title = req.body.title;
	var isDeductive = req.body.isDeductive;
	var premises = req.body.premises;
	var conclusion = req.body.conclusion;
	
	var argument = {
		title: title,
		isDeductive: isDeductive,
		isAtomic: true
	}
	
	vertex.argument.save(argument).then( result => {
		emitter.emit('saveArg', result.vertex._id);
	});
	
	emitter.on('saveArg', argId => {
		modules.async.map(
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
		modules.async.each(
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
	});
	
	emitter.on('connectPremises', argId => {
		vertex.statement.save({content: conclusion}).then( result => {
			emitter.emit('saveConclusion', argId, result.vertex._id);
		});
	});
	
	emitter.on('saveConclusion', (argId, stmtId) => {
		edge.conclusion.save({}, argId, stmtId).then( () => {
			emitter.emit('connectConclusion');
		});
	});
	
	emitter.on('connectConclusion', () => {
		res.send({
			success:true
		});
	});
});

/*------------------------------*\
 *	Global functions						*
\*------------------------------*/
var newEmitter = function() {
	return new modules.events.EventEmitter();
}
