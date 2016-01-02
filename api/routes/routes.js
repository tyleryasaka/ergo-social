/******************************************************************************\
 * @file: api/routes/routes.js
 * @description: api routes
 * @author: Tyler Yasaka 
\******************************************************************************/

var ROUTER = require('express').Router();
var PROTECTED = require('connect-ensure-login').ensureLoggedIn;
var PASSPORT = require('passport');
var CONTROLLER = require('../controllers/controllers.js');
var FILTER = require('../lib/filters.js');

ROUTER.post('/0.0/account', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	
	CONTROLLER.account.create(username, password, result => {
		res.send(result);
	});
});
	
ROUTER.put('/0.0/account/password', PROTECTED(), (req, res) => {
	var oldPass = req.body.oldPassword;
	var newPass = req.body.newPassword;
	
	CONTROLLER.account.updatePassword(oldPass, newPass, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/login', (req, res) => {
	var response = {status: "success", data: {isLoggedIn: false}};
	if(typeof req.user != 'undefined'){
		response.data.isLoggedIn = true;
		response.data.user = req.user;
	}
	res.send(response);
});

ROUTER.post('/0.0/login',
	PASSPORT.authenticate('local', {
		successReturnToOrRedirect: '/0.0/argument',
		failureRedirect: '/login'
	})
);

ROUTER.get('/0.0/logout', (req, res) => {
	req.logout();
	res.send({});//res.redirect('/0.0/login');
});

ROUTER.post('/0.0/argument', PROTECTED(), (req, res) => {
	var argument = FILTER.argument(req.body.argument, req.user);
	var conclusion = FILTER.conclusion(req.body.conclusion, req.user);
	
	CONTROLLER.argument.create(argument, conclusion, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/argument', PROTECTED(), (req, res) => {
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

ROUTER.put('/0.0/argument/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	var argument = FILTER.argument(req.body, req.user);
	
	CONTROLLER.argument.update(key, argument, req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/argument/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	
	CONTROLLER.argument.remove(key, req.user, result => {
		res.send(result);
	});
});

//ROUTER.get('/0.0/profile', CONTROLLER.profile.get);

ROUTER.post('/0.0/premise', PROTECTED(), (req, res) => {
	var premise = FILTER.premise(req.body, req.user);
	
	CONTROLLER.premise.create(premise, req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/premise/:argKey/:premiseKey', PROTECTED(), (req, res) => {
	var argKey = req.params.argKey;
	var premiseKey = req.params.premiseKey;
	
	CONTROLLER.premise.remove(argKey, premiseKey, req.user, result => {
		res.send(result);
	});
});

ROUTER.post('/0.0/comment', PROTECTED(), (req, res) => {
	var statement = FILTER.statement(req.body.statement, req.user);
	var subjectId = req.body.subject._id;
	
	CONTROLLER.comment.create(statement, subjectId, req.user, result => {
		res.send(result);
	});
});

ROUTER.get('/0.0/comment', PROTECTED(), (req, res) => {
	CONTROLLER.comment.listForUser( req.user, result => {
		res.send(result);
	});
});

ROUTER.delete('/0.0/comment/:subjectType/:subjectKey/:commentKey', PROTECTED(), (req, res) => {
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

ROUTER.put('/0.0/statement/:key', PROTECTED(), (req, res) => {
	var key = req.params.key;
	var statement = FILTER.statement(req.body, req.user);
	
	CONTROLLER.statement.update(key, statement, req.user, result => {
		res.send(result);
	});
});

module.exports = ROUTER;


