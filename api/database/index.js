/******************************************************************************\
 * @file api/database/index.js
 * @description ArangoDB database connector
 * @author Tyler Yasaka 
\******************************************************************************/

var DBNAME = "ergo";
exports.graphName = "ergoGraph";

var ARANGO = require('arangojs')();

ARANGO.useDatabase(DBNAME);

//graph object
var GRAPH = ARANGO.graph(exports.graphName);

exports.conn = ARANGO;

//object to hold vertex collections
exports.v = {
	statement: GRAPH.vertexCollection('statement'),
	argument: GRAPH.vertexCollection('argument'),
	user: GRAPH.vertexCollection('user')
}

//object to hold edge collections
exports.e = {
	premise: GRAPH.edgeCollection('premise'),
	conclusion: GRAPH.edgeCollection('conclusion'),
	comment: GRAPH.edgeCollection('comment'),
	author: GRAPH.edgeCollection('author')
}
