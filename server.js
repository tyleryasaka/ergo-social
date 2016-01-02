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

var EXPRESS = require('express');
var EXPRESS_SESSION = require('express-session');
var BODY_PARSER = require('body-parser');
var PASSPORT = require('passport');
var STRATEGY = require('passport-local').Strategy;
var ROUTES = require('./api/routes/routes.js');
var CONTROLLER = require('./api/controllers/controllers.js');

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

APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());

// serve api requests with routes
APP.use('/api', ROUTES);

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
