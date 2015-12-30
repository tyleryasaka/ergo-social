/******************************************************************************\
 * @file: api/index.js
 * @description: api server
 * @author: Tyler Yasaka 
\******************************************************************************/

/******************************************************************************\
 * Configuration options
\******************************************************************************/

var PORT = 8080; // port to serve the api
var SESSION_SECRET = 'test123'; // sign session id cookie

//temporary
var author = 'tyler';

/******************************************************************************\
 * node modules
\******************************************************************************/

BODY_PARSER = require('body-parser');
EXPRESS = require('express');
EXPRESS_SESSION = require('express-session');

/******************************************************************************\
 * custom modules
\******************************************************************************/

var CONTROLLER = require('./controllers/index.js');

/******************************************************************************\
 * initializing api
\******************************************************************************/
 
var APP = EXPRESS();

// parse json post data
APP.use(BODY_PARSER.json());

// initialize session
APP.use(EXPRESS_SESSION({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

// serve static content
APP.use(EXPRESS.static(__dirname + '/../public'));

//Begin listening for requests
var SERVER = APP.listen(PORT, () => {
	var host = SERVER.address().address;
	var port = SERVER.address().port;
	console.log('ergo listening on ' + host + ':' + port);
});
	
/******************************************************************************\
 * routes
\******************************************************************************/

APP.post('/0.0/argument', (req, res) => {
	var argument = FILTER.argument(req.body.argument, author);
	var conclusion = FILTER.conclusion(req.body.conclusion, author);
	
	CONTROLLER.argument.create(argument, conclusion, author, result => {
		res.send(result);
	});
});

APP.get('/0.0/argument', (req, res) => {
	CONTROLLER.argument.list( author, result => {
		res.send(result);
	});
});

APP.get('/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.get(key, result => {
		res.send(result);
	});
});

APP.put('/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	var argument = FILTER.argument(req.body, author);
	
	CONTROLLER.argument.update(key, argument, author, result => {
		res.send(result);
	});
});

APP.delete('/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.remove(key, author, result => {
		res.send(result);
	});
});

//APP.get('/0.0/profile', CONTROLLER.profile.get);

APP.post('/0.0/premise', (req, res) => {
	var premise = FILTER.premise(req.body, author);
	
	CONTROLLER.premise.create(premise, author, result => {
		res.send(result);
	});
});

APP.delete('/0.0/premise/:argKey/:premiseKey', (req, res) => {
	var argKey = req.params.argKey;
	var premiseKey = req.params.premiseKey;
	
	CONTROLLER.premise.remove(argKey, premiseKey, author, result => {
		res.send(result);
	});
});

APP.put('/0.0/statement/:key', (req, res) => {
	var key = req.params.key;
	var statement = FILTER.statement(req.body, author);
	
	CONTROLLER.statement.update(key, statement, author, result => {
		res.send(result);
	});
});

/******************************************************************************\
 * filters
\******************************************************************************/

var FILTER = {}; // filters validate user input

/******************************************************************************\
 * @function filter.argument
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
FILTER.argument = function(input, author) {
	var output = {
		author: author,
		title: input.title,
		isDeductive: input.isDeductive,
		isAtomic: false // default
	};
	
	if(input.isAtomic){
		output.isAtomic = true;
	}
	
	return output;
}

/******************************************************************************\
 * @function filter.statement
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
FILTER.statement = function(input, author) {
	var output = {
		author: author,
		content: input.content
	};
	
	return output;
}

/******************************************************************************\
 * @function filter.premise
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
FILTER.premise = function(input, author) {
	var output = {
		argKey: input.argument ? input.argument._key : '',
		statement: {}
	};
	
	if(input.statement){
		if(input.statement._key){
			output.statement._key = input.statement._key;
		} else {
			output.statement = FILTER.statement(input.statement, author);
		}
	}
	
	return output;
}

/******************************************************************************\
 * @function filter.premise
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
FILTER.conclusion = function(input, author) {
	var output = {};
	
	if(typeof input._key != 'undefined'){
		output._key = input._key;
	} else {
		output = FILTER.statement(input, author);
	}
	
	return output;
}
