/******************************************************************************\
 * @file: api/routes/routes.js
 * @description: api routes
 * @author: Tyler Yasaka 
\******************************************************************************/

/******************************************************************************\
 * Configuration options
\******************************************************************************/

var SESSION_SECRET = 'test123'; // sign session id cookie

/******************************************************************************\
 * modules
\******************************************************************************/

var ROUTER = require('express').Router();
var PASSPORT = require('passport');
var STRATEGY = require('passport-local').Strategy;
var EXPRESS_SESSION = require('express-session');
var BODY_PARSER = require('body-parser');
var CONTROLLER = require('../controllers/controllers.js');
var FILTER = require('../lib/filters.js');
var LIB = require('../lib/lib.js');

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

// parse json post data
ROUTER.use(BODY_PARSER.json());

// initialize session
ROUTER.use(EXPRESS_SESSION({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}));

ROUTER.use(PASSPORT.initialize());
ROUTER.use(PASSPORT.session());

/******************************************************************************\
 * routes
\******************************************************************************/

ROUTER.post('/0.0/account', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	
	CONTROLLER.account.create(username, password, result => {
		res.send(result);
	});
});
	
ROUTER.put('/0.0/account/password', LIB.protect, (req, res) => {
	var oldPass = req.body.oldPassword;
	var newPass = req.body.newPassword;
	
	CONTROLLER.account.updatePassword(oldPass, newPass, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/login', LIB.protect, (req, res) => {
	var isLoggedIn = false;
	if( req.isAuthenticated() ){
		isLoggedIn = true;
	}
	res.send( LIB.successMsg( {isLoggedIn: isLoggedIn} ) );
});

/*ROUTER.post('/0.0/login', (req, res, next) => {
	PASSPORT.authenticate('local', (err, user) => {
		if(err) {
			res.send(err);
		} else {
			res.send(LIB.successMsg({}));
		}
	})(req, res, next);
});*/

ROUTER.post('/api/0.0/login',
	PASSPORT.authenticate('local', {
		successReturnToOrRedirect: '/api/0.0/argument',
		failureRedirect: '/login'
	})
);

ROUTER.get('/0.0/logout', (req, res) => {
	req.logout();
	res.send({});
});

ROUTER.post('/0.0/argument', LIB.protect, (req, res) => {
	var argument = FILTER.argument(req.body.argument, req.user);
	var conclusion = FILTER.conclusion(req.body.conclusion, req.user);
	
	CONTROLLER.argument.create(argument, conclusion, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/argument', LIB.protect, (req, res) => {
	CONTROLLER.argument.list( req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.get(key, result => {
		res.send(result);
	});
});

ROUTER.put('/0.0/argument/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	var argument = FILTER.argument(req.body, req.user);
	
	CONTROLLER.argument.update(key, argument, req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/argument/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.remove(key, req.user, result => {
		res.send(result);
	});
});

//ROUTER.get('/0.0/profile', CONTROLLER.profile.get);

ROUTER.post('/0.0/premise', LIB.protect, (req, res) => {
	var premise = FILTER.premise(req.body, req.user);
	
	CONTROLLER.premise.create(premise, req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/premise/:argKey/:premiseKey', LIB.protect, (req, res) => {
	var argKey = req.params.argKey;
	var premiseKey = req.params.premiseKey;
	
	CONTROLLER.premise.remove(argKey, premiseKey, req.user, result => {
		res.send(result);
	});
});

ROUTER.post('/0.0/comment', LIB.protect, (req, res) => {
	var statement = FILTER.statement(req.body.statement, req.user);
	var subjectId = req.body.subject._id;
	
	CONTROLLER.comment.create(statement, subjectId, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/comment', LIB.protect, (req, res) => {
	CONTROLLER.comment.listForUser( req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/comment/:subjectType/:subjectKey/:commentKey', LIB.protect, (req, res) => {
	var subjectId = req.params.subjectType + '/' + req.params.subjectKey;
	var commentKey = req.params.commentKey;
	
	CONTROLLER.comment.remove(subjectId, commentKey, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/statement/:stmtKey', (req, res) => {
	var stmtKey = req.params.stmtKey;
	
	CONTROLLER.statement.get(stmtKey, result => {
		res.send(result);
	});
});

ROUTER.put('/0.0/statement/:key', LIB.protect, (req, res) => {
	var key = req.params.key;
	var statement = FILTER.statement(req.body, req.user);
	
	CONTROLLER.statement.update(key, statement, req.user, result => {
		res.send(result);
	});
});

module.exports = ROUTER;


