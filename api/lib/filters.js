/******************************************************************************\
 * @file: api/lib/filters.js
 * @description: api routes
 * @author: Tyler Yasaka 
\******************************************************************************/

/******************************************************************************\
 * @function argument
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
exports.argument = function(input, author) {
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
 * @function statement
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
exports.statement = function(input, author) {
	var output = {
		author: author,
		content: input.content
	};
	
	return output;
}

/******************************************************************************\
 * @function premise
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
exports.premise = function(input, author) {
	var output = {
		argKey: input.argument ? input.argument._key : '',
		statement: {}
	};
	
	if(input.statement){
		if(input.statement._key){
			output.statement._key = input.statement._key;
		} else {
			output.statement = exports.statement(input.statement, author);
		}
	}
	
	return output;
}

/******************************************************************************\
 * @function premise
 * @desc Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @param input => unfiltered data from user
 * @param author => logged in user who is sending the data
 * @return filtered data
\******************************************************************************/
exports.conclusion = function(input, author) {
	var output = {};
	
	if(typeof input._key != 'undefined'){
		output._key = input._key;
	} else {
		output = exports.statement(input, author);
	}
	
	return output;
}
