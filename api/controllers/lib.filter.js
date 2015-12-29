/******************************************************************************\
 * @file api/controllers/lib.filter.js
 * 
 * @description Sanitizes input in the sense of not allowing user to create
 * 	custom document fields. Also easier to maintain fields in one place.
 * @application ergo
 * @author Tyler Yasaka 
\******************************************************************************/

exports.argument = function(input, author) {
	var output = {};
	
	output.author = author;
	output.title = input.title;
	output.isDeductive = input.isDeductive;
	
	output.isAtomic = false; // default
	if(input.isAtomic){
		output.isAtomic = true;
	}
	
	return output;
}

exports.statement = function(input, author) {
	var output = {};
	
	output.author = author;
	output.content = input.content;
	
	return output;
}
