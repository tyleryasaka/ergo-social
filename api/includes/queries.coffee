#-------------------------------------------------------------
#																															
#	Application:	ergo																					
#	Filename:			queries.coffee																		
#	Authors:			Tyler Yasaka																	
#																															
#-------------------------------------------------------------

#Compiles into queries.js

#All AQL queries are retrieved from here

exports.getArgument = #tyler, return whether each premise is a conclusion
"
	RETURN {
		argument: (
			FOR a IN argument
				FILTER a._id == @argId
				RETURN a
		)[0],
		premises: (
			FOR v IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'premise'})
				RETURN (
					FOR s IN statement
						FILTER s._id == v
						RETURN s
				)[0]
		),
		conclusion: (
			FOR v IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'conclusion'})
				RETURN (
					FOR s IN statement
						FILTER s._id == v
						RETURN s
				)[0]
		)[0]
	}
"

exports.isConclusion =
"
RETURN (
	FOR e IN GRAPH_EDGES(@graphName, @stmtId, {edgeCollectionRestriction: 'conclusion'})
		COLLECT WITH COUNT INTO length
		RETURN length
)[0] != 0
"
