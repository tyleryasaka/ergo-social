#
# @file: queries.coffee
# 
# @author: Tyler Yasaka
# @description compiles into queries.js
# 	all AQL quries are retrieved from here
#

#
# to compile this into the javascript file:
#
# 	coffee --compile index.coffee
#

exports.getArgument =
"
	RETURN {
	
		argument: (
			FOR a IN argument
				FILTER a._id == @argId
				RETURN a
		)[0],
		
		premises: (
				FOR premiseStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'premise'})
					RETURN {
						statement: (
							FOR s IN statement
								FILTER s._id == premiseStatement
								RETURN s
						)[0],
						subarguments: (
							FOR subargument IN GRAPH_NEIGHBORS(@graphName, premiseStatement, {edgeCollectionRestriction: 'conclusion'})
								RETURN subargument
						),
						comments: (
							FOR comment IN GRAPH_NEIGHBORS(@graphName, premiseStatement, {edgeCollectionRestriction: 'comment'})
								RETURN comment
						)
					}
		),
		
		conclusion: (
			FOR conclusionStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'conclusion'})
				RETURN {
					statement: (
						FOR s IN statement
							FILTER s._id == conclusionStatement
							RETURN s
					)[0],
					comments: (
						FOR comment IN GRAPH_NEIGHBORS(@graphName, conclusionStatement, {edgeCollectionRestriction: 'comment'})
							RETURN comment
					)
				}
		)[0],
		
		comments: (
				FOR commentStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'comment'})
					RETURN {
						statement: (
							FOR s IN statement
								FILTER s._id == commentStatement
								RETURN s
						)[0],
						subarguments: (
							FOR subargument IN GRAPH_NEIGHBORS(@graphName, commentStatement, {edgeCollectionRestriction: 'conclusion'})
								RETURN subargument
						),
						comments: (
							FOR subComment IN GRAPH_NEIGHBORS(@graphName, commentStatement, {edgeCollectionRestriction: 'comment', direction: 'inbound'})
								RETURN subComment
						)
					}
		)
		
	}
"

# returns true if the statement is not used as a premise, conclusion, or comment
#	for the specified user
exports.isOrphaned =
"
RETURN (
	FOR e IN GRAPH_EDGES (
		@graphName, @stmtId, {
			edgeCollectionRestriction: ['premise', 'conclusion', 'comment'],
			edgeExamples: [{author: @authorId}]
		}
	)
		COLLECT WITH COUNT INTO length
		RETURN length
)[0] == 0
"

exports.getPremisesForArgument =
"
	FOR premiseStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'premise'})
		RETURN premiseStatement
"

exports.getConclusionForArgument =
"
	FOR conclusionStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'conclusion'})
		RETURN conclusionStatement
"

exports.getStatement =
"
	RETURN {
		statement: (
			FOR s IN statement
				FILTER s._id == @stmtId
				RETURN s
		),
		subarguments: (
			FOR subargument IN GRAPH_NEIGHBORS(@graphName, @stmtId, {edgeCollectionRestriction: 'conclusion'})
				RETURN subargument
		),
		comments: (
			FOR subComment IN GRAPH_NEIGHBORS(@graphName, @stmtId, {edgeCollectionRestriction: 'comment', direction: 'inbound'})
				RETURN subComment
		)
	}
"
