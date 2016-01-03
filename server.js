/******************************************************************************\
 * @file: server.js
 * @description: the server
 * @author: Tyler Yasaka 
\******************************************************************************/

/******************************************************************************\
 * Configuration options
\******************************************************************************/

var PORT = 8080; // port to serve the api
var SESSION_SECRET = 'test123'; // sign session id cookie

/******************************************************************************\
 * modules
\******************************************************************************/

var BODY_PARSER = require('body-parser');
var EXPRESS = require('express');
var EXPRESS_SESSION = require('express-session');
//var APP = require('express').Router();
var PASSPORT = require('passport');
var STRATEGY = require('passport-local').Strategy;
//var PROTECTED = require('connect-ensure-login').ensureLoggedIn;

/******************************************************************************\
 * custom modules
\******************************************************************************/

var CONTROLLER = require('./api/controllers/controllers.js');
var FILTER = require('./api/lib/filters.js');
var LIB = require('./api/lib/lib.js');

/******************************************************************************\
 * setup passport authentication
\******************************************************************************/

PASSPORT.serializeUser( (user, callback) => {
	callback(null, user._key);
});

PASSPORT.deserializeUser( (key, callback) => {
	callback(null, key);
});

PASSPORT.use(new STRATEGY(CONTROLLER.account.authenticate));

/******************************************************************************\
 * server setup
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

APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());

/******************************************************************************\
 * routes
\******************************************************************************/

APP.post('/api/0.0/account', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	
	CONTROLLER.account.create(username, password, result => {
		res.send(result);
	});
});
	
APP.put('/api/0.0/account/password', LIB.protect, (req, res) => {
	var oldPass = req.body.oldPassword;
	var newPass = req.body.newPassword;
	
	CONTROLLER.account.updatePassword(oldPass, newPass, req.user, result => {
		res.send(result);
	});
});

APP.get('/api/0.0/login', (req, res) => {
	var isLoggedIn = false;
	if( req.isAuthenticated() ){
		isLoggedIn = true;
	}
	res.send( LIB.successMsg( {isLoggedIn: isLoggedIn} ) );
});

APP.post('/api/0.0/login', function(req, res, next) {
  PASSPORT.authenticate('local', function(err, user, info) {
		if(err) {
			return res.send(err);
		} else {
			req.logIn(user, function(err) {
				return res.send(LIB.successMsg({}));
			});
		}
  })(req, res, next);
});

APP.get('/api/0.0/logout', (req, res) => {
	req.logout();
	res.send({});
});

APP.post('/api/0.0/argument', LIB.protect, (req, res) => {
	var argument = FILTER.argument(req.body.argument, req.user);
	var conclusion = FILTER.conclusion(req.body.conclusion, req.user);
	
	CONTROLLER.argument.create(argument, conclusion, req.user, result => {
		res.send(result);
	});
});

APP.get('/api/0.0/argument', LIB.protect, (req, res) => {
	CONTROLLER.argument.list( req.user, result => {
		res.send(result);
	});
});

APP.get('/api/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.get(key, result => {
		res.send(result);
	});
});

APP.put('/api/0.0/argument/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	var argument = FILTER.argument(req.body, req.user);
	
	CONTROLLER.argument.update(key, argument, req.user, result => {
		res.send(result);
	});
});

APP.delete('/api/0.0/argument/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.remove(key, req.user, result => {
		res.send(result);
	});
});

//APP.get('/api/0.0/profile', CONTROLLER.profile.get);

APP.post('/api/0.0/premise', LIB.protect, (req, res) => {
	var premise = FILTER.premise(req.body, req.user);
	
	CONTROLLER.premise.create(premise, req.user, result => {
		res.send(result);
	});
});

APP.delete('/api/0.0/premise/:argKey/:premiseKey', LIB.protect, (req, res) => {
	var argKey = req.params.argKey;
	var premiseKey = req.params.premiseKey;
	
	CONTROLLER.premise.remove(argKey, premiseKey, req.user, result => {
		res.send(result);
	});
});

APP.post('/api/0.0/comment', LIB.protect, (req, res) => {
	var statement = FILTER.statement(req.body.statement, req.user);
	var subjectId = req.body.subject._id;
	
	CONTROLLER.comment.create(statement, subjectId, req.user, result => {
		res.send(result);
	});
});

APP.get('/api/0.0/comment', LIB.protect, (req, res) => {
	CONTROLLER.comment.listForUser( req.user, result => {
		res.send(result);
	});
});

APP.delete('/api/0.0/comment/:subjectType/:subjectKey/:commentKey', LIB.protect, (req, res) => {
	var subjectId = req.params.subjectType + '/' + req.params.subjectKey;
	var commentKey = req.params.commentKey;
	
	CONTROLLER.comment.remove(subjectId, commentKey, req.user, result => {
		res.send(result);
	});
});

APP.get('/api/0.0/statement/:stmtKey', (req, res) => {
	var stmtKey = req.params.stmtKey;
	
	CONTROLLER.statement.get(stmtKey, result => {
		res.send(result);
	});
});

APP.put('/api/0.0/statement/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	var statement = FILTER.statement(req.body, req.user);
	
	CONTROLLER.statement.update(key, statement, req.user, result => {
		res.send(result);
	});
});

/******************************************************************************\
 * server initialization
\******************************************************************************/

// serve static content with angularjs
APP.use('/app', EXPRESS.static(__dirname + '/public/app'));

// all other requests go to public/index.html
APP.get('/*', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

//Begin listening for requests
var SERVER = APP.listen(PORT, () => {
	var host = SERVER.address().address;
	var port = SERVER.address().port;
	console.log('ergo listening on ' + host + ':' + port);
});
