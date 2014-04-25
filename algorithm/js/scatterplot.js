// Generate a scatter plot for the given series of datapoints.
function scatterplot(args) {
  var root = $('<div/>');
  chart = $('<div/>').appendTo(root);
  legend = $('<div/>').appendTo(root);
  var graph = new Rickshaw.Graph({
    element: chart[0],
    width: args.width,
    height: args.height,
    renderer: 'scatterplot',
    series: args.series
  });
  graph.renderer.dotSize = 6;
  new Rickshaw.Graph.HoverDetail( {
    graph: graph,
    xFormatter: function(x) { return x; }
  });
  new Rickshaw.Graph.Legend( {
    element: legend[0],
    graph: graph
  });
  graph.update();
  legend.position({
    my: "left bottom",
    at: "left bottom",
    of: chart
  });
  legend.css({
    top: -60 + 'px',
    left: 25 + 'px'
  });
  return root;
}

