// Generated by CoffeeScript 1.10.0
(function() {
  exports.getArgument = "RETURN { argument: ( FOR a IN argument FILTER a._id == @argId RETURN a )[0], premises: ( FOR premiseStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'premise'}) RETURN { statement: ( FOR s IN statement FILTER s._id == premiseStatement RETURN s )[0], subargument: ( FOR subargument IN GRAPH_NEIGHBORS(@graphName, premiseStatement, {edgeCollectionRestriction: 'conclusion'}) RETURN subargument ) } ), conclusion: ( FOR conclusionStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'conclusion'}) RETURN { statement: ( FOR s IN statement FILTER s._id == conclusionStatement RETURN s )[0], superargument: ( FOR superargument IN GRAPH_NEIGHBORS(@graphName, conclusionStatement, {edgeCollectionRestriction: 'premise'}) RETURN superargument ) } )[0] }";

  exports.isOrphaned = "RETURN ( FOR e IN GRAPH_EDGES( @graphName, @stmtId, { edgeCollectionRestriction: ['premise', 'conclusion', 'comment'], edgeExamples: [{author: @authorId}] } ) COLLECT WITH COUNT INTO length RETURN length )[0] == 0";

  exports.getPremisesForArgument = "FOR premiseStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'premise'}) RETURN premiseStatement";

  exports.getConclusionForArgument = "FOR conclusionStatement IN GRAPH_NEIGHBORS(@graphName, @argId, {edgeCollectionRestriction: 'conclusion'}) RETURN conclusionStatement";

}).call(this);
