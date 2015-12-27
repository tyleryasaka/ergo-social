/*-------------------------------------------------------------*\
|																																|
|	Application:	ergo																						|
|	Filename:			models.js																				|
|	Authors:			Tyler Yasaka																		|
|																																|
\*-------------------------------------------------------------*/

//Models for objects that can be manipulated by users
//Sanitizes input in the sense of not allowing user to create custom document fields
//Also easier to maintain fields in one place

exports.argument = function(input, author) {
	var output = {};
	
	output.author = author;
	output.title = input.title;
	output.isDeductive = input.isDeductive;
	output.isAtomic = false;//default
	
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
