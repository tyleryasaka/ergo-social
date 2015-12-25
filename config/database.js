//Config options
var dbName = "ergo";
var graphName = "ergoGraph";

//Requirements
var graph_module = require("org/arangodb/general-graph");

//Create database
db._useDatabase("_system");
var allDatabases = db._listDatabases();
if (allDatabases.indexOf(dbName) != -1) {
	db._dropDatabase(dbName);
}
db._createDatabase(dbName);

//Define valid edges for graph
var edgeDefinitions = [
	graph_module._relation("premise", ["statement"], ["argument"]),
	graph_module._relation("conclusion", ["argument"], ["statement"]),
	graph_module._relation("comment", ["statement"], ["statement","argument"]),
	graph_module._relation("author", ["statement", "argument"], ["user"])
];

//Create graph
var allGraphs = graph_module._list();
if(allGraphs.indexOf(graphName) != -1){
	graph_module._drop(graphName, true);
}
var graph = graph_module._create(graphName,edgeDefinitions);
