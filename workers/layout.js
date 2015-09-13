var graph = require('ngraph.graph')();
var nodePositions = {};

var createLayout = function (graph) {
    var layout = require('ngraph.forcelayout'),
        physics = require('ngraph.physics.simulator');

    return layout(graph, physics({
        springLength: 30,
        springCoeff: 0.0001,
        dragCoeff: 0.01,
        gravity: -0.5,
        theta: 0.5
    }));
};

module.exports = function (self) {
    var _jNodeIds = {};
    var layout = createLayout(graph);

    self.addEventListener('message', function (ev) {
        var data = ev.data.jsonData;

        data.nodes.forEach(function (jNode, i) {
            //_nodesById[node.id] = node;
            var vNode = graph.addNode(jNode.id);
            _jNodeIds[vNode.id] = jNode.id;
        });
        data.edges.forEach(function (edge, i) {
            //if (edge.weight < 6) return;
            graph.addLink(edge.source, edge.target, {connectionStrength: edge.weight});
        });

        graph.forEachNode(function (node) {
            nodePositions[_jNodeIds[node.id]] = layout.getNodePosition(node.id);
        });

        var iterations = parseInt(ev.data.iterations); // ev.data=4 from main.js

        for (var i = 0; i < iterations; i++) {
            layout.step();
            if (i % ev.data.stepsPerMessage === 0) {
                //because the layout can happen much faster than the render loop, reduce overhead by not passing every loop
                self.postMessage({i: i, nodePositions: nodePositions});
            }
        }
        self.postMessage({i: iterations, nodePositions: nodePositions});
    });

};

