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

/******************************************************************************\
 * node modules
\******************************************************************************/

var BODY_PARSER = require('body-parser');
var EXPRESS = require('express');
var EXPRESS_SESSION = require('express-session');
var PASSPORT = require('passport');
var STRATEGY = require('passport-local').Strategy;
var PROTECTED = require('connect-ensure-login').ensureLoggedIn;

/******************************************************************************\
 * custom modules
\******************************************************************************/

var CONTROLLER = require('./controllers/index.js');

/******************************************************************************\
 * setup password authentication
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

// serve static content
APP.use(EXPRESS.static(__dirname + '/../public'));

APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());

//Begin listening for requests
var SERVER = APP.listen(PORT, () => {
	var host = SERVER.address().address;
	var port = SERVER.address().port;
	console.log('ergo listening on ' + host + ':' + port);
});
	
/******************************************************************************\
 * routes
\******************************************************************************/

APP.post('/0.0/account', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	
	CONTROLLER.account.create(username, password, result => {
		res.send(result);
	});
});
	
APP.put('/0.0/account/password', PROTECTED(), (req, res) => {
	var oldPass = req.body.oldPassword;
	var newPass = req.body.newPassword;
	
	CONTROLLER.account.updatePassword(oldPass, newPass, req.user, result => {
		res.send(result);
	});
});

APP.get('/0.0/login', (req, res) => {
	var response = {isLoggedIn: false};
	if(typeof req.user != 'undefined'){
		response.isLoggedIn = true;
		response.user = req.user;
	}
	res.send(response);
});

APP.post('/0.0/login',
	PASSPORT.authenticate('local', {
		successReturnToOrRedirect: '/0.0/argument',
		failureRedirect: '/login'
	})
);

APP.get('/0.0/logout', (req, res) => {
	req.logout();
	res.send({});//res.redirect('/0.0/login');
});

APP.post('/0.0/argument', PROTECTED(), (req, res) => {
	var argument = FILTER.argument(req.body.argument, req.user);
	var conclusion = FILTER.conclusion(req.body.conclusion, req.user);
	
	CONTROLLER.argument.create(argument, conclusion, req.user, result => {
		res.send(result);
	});
});

APP.get('/0.0/argument', PROTECTED(), (req, res) => {
	CONTROLLER.argument.list( req.user, result => {
		res.send(result);
	});
});

APP.get('/0.0/argument/:key', (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.get(key, result => {
		res.send(result);
	});
});

APP.put('/0.0/argument/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	var argument = FILTER.argument(req.body, req.user);
	
	CONTROLLER.argument.update(key, argument, req.user, result => {
		res.send(result);
	});
});

APP.delete('/0.0/argument/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.remove(key, req.user, result => {
		res.send(result);
	});
});

//APP.get('/0.0/profile', CONTROLLER.profile.get);

APP.post('/0.0/premise', PROTECTED(), (req, res) => {
	var premise = FILTER.premise(req.body, req.user);
	
	CONTROLLER.premise.create(premise, req.user, result => {
		res.send(result);
	});
});

APP.delete('/0.0/premise/:argKey/:premiseKey', PROTECTED(), (req, res) => {
	var argKey = req.params.argKey;
	var premiseKey = req.params.premiseKey;
	
	CONTROLLER.premise.remove(argKey, premiseKey, req.user, result => {
		res.send(result);
	});
});

APP.post('/0.0/comment', PROTECTED(), (req, res) => {
	var statement = FILTER.statement(req.body.statement, req.user);
	var subjectId = req.body.subject._id;
	
	CONTROLLER.comment.create(statement, subjectId, req.user, result => {
		res.send(result);
	});
});

APP.get('/0.0/comment', PROTECTED(), (req, res) => {
	CONTROLLER.comment.listForUser( req.user, result => {
		res.send(result);
	});
});

APP.delete('/0.0/comment/:subjectType/:subjectKey/:commentKey', PROTECTED(), (req, res) => {
	var subjectId = req.params.subjectType + '/' + req.params.subjectKey;
	var commentKey = req.params.commentKey;
	
	CONTROLLER.comment.remove(subjectId, commentKey, req.user, result => {
		res.send(result);
	});
});

APP.get('/0.0/statement/:stmtKey', (req, res) => {
	var stmtKey = req.params.stmtKey;
	
	CONTROLLER.statement.get(stmtKey, result => {
		res.send(result);
	});
});

APP.put('/0.0/statement/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	var statement = FILTER.statement(req.body, req.user);
	
	CONTROLLER.statement.update(key, statement, req.user, result => {
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
