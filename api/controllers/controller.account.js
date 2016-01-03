/******************************************************************************\
 * @file api/controllers/controller.account.js
 * @description account controller
 * @author Tyler Yasaka 
\******************************************************************************/

var ASYNC = require('async');
var LIB = require('../lib/lib.js');
var DB = require('../database/connect.js');

/******************************************************************************\
 * @function create
 * @desc create an account
 * @param username => account username
 * @param password => account password
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.create = (username, password, callback) => {
	username = username.toLowerCase();
	password = LIB.encrypt(password);
	var pattern = /^[a-z0-9]+$/;
	
	ASYNC.waterfall(
		[
			function(next) {
				if( pattern.test(username) ) {
					DB.v.user.byExample({_key: username}).then( data => {
						if(data._result.length == 0){
							next(null);
						} else {
							next( LIB.errMsg('Username exists') );
						}
					});
				} else {
					next( LIB.errMsg('Invalid username') );
				}
			},
			
			function(next) {
				DB.v.user.save({_key: username, password: password})
				.then( data => {
					next(null, data.vertex);
				});
			}
		],
		
		function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback( LIB.successMsg(result) );
			}
		}
	
	);
}

/******************************************************************************\
 * @function updatePassword
 * @desc change account password
 * @param oldPass => old password
 * @param newPass => new password
 * @param username => account username
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
exports.updatePassword = function(oldPass, newPass, username, callback) {
	oldPass = LIB.encrypt(oldPass);
	newPass = LIB.encrypt(newPass);
	
	DB.v.user.updateByExample(
		{_key: username, password: oldPass},
		{password: newPass}
	).then( data => {
		if(data.updated > 0) {
			callback( LIB.successMsg({}) );
		} else {
			callback( LIB.errMsg('Old password invalid') );
		}
	});
}

/******************************************************************************\
 * @function authenticate
 * @desc authenticate a username/password combination
 * @param username => account username
 * @param password => account password
 * @param callback => function to call (with result parameter) when done
\******************************************************************************/
/*exports.authenticate = (username, password, callback) => {
	var password = LIB.encrypt(password);
	
	DB.v.user.byExample({_key: username, password: password})
	.then( data => {
		if(data._result.length > 0){
			callback(null, data._result[0]);
		} else {
			callback(LIB.errMsg('Invalid credentials'), false);
		}
	});
}*/
exports.authenticate = (username, password, callback) => {
	var password = LIB.encrypt(password);
	
	DB.v.user.byExample({_key: username, password: password})
	.then( data => {
		if(data._result.length > 0){
			callback(null, data._result[0]);
		} else {
			callback(null, false);
		}
	});
}
