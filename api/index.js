/******************************************************************************\
 * @file: api/index.js
 * @description: api server
 * @application: ergo
 * @author: Tyler Yasaka 
\******************************************************************************/

/******************************************************************************\
 * Configuration options
\******************************************************************************/

var PORT = 8080; // port to serve the api
var SESSION_SECRET = 'test123'; // sign session id cookie

/******************************************************************************\
 * node modules
\******************************************************************************/

var MOD = {};
MOD.bodyParser = require('body-parser');
MOD.express = require('express');
MOD.expressSession = require('express-session');


/******************************************************************************\
 * custom modules
\******************************************************************************/

var CONTROLLER = require('./controllers/index.js');


/******************************************************************************\
 * initializing api
\******************************************************************************/
 
var APP = MOD.express();

// parse json post data
APP.use(MOD.bodyParser.json());

// initialize session
APP.use(MOD.expressSession({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

// serve static content
APP.use(MOD.express.static(__dirname + '/../public'));

//Begin listening for requests
var SERVER = APP.listen(PORT, () => {
	var host = SERVER.address().address;
	var port = SERVER.address().port;
	console.log('ergo listening on ' + host + ':' + port);
});
	
/******************************************************************************\
 * routes
\******************************************************************************/

APP.post('/0.0/argument', CONTROLLER.argument.create);

APP.get('/0.0/argument', CONTROLLER.argument.list);

APP.get('/0.0/argument/:key', CONTROLLER.argument.get);

APP.put('/0.0/argument/:key', CONTROLLER.argument.update);

APP.delete('/0.0/argument/:key', CONTROLLER.argument.remove);

//APP.get('/0.0/profile', CONTROLLER.profile.get);

APP.put('/0.0/statement/:key', CONTROLLER.statement.update);

APP.post('/0.0/premise', CONTROLLER.premise.create);

APP.delete('/0.0/premise/:argKey/:premiseKey', CONTROLLER.premise.remove);

