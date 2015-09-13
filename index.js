var work = require('webworkify');
var w = work(require('./workers/layout'));
var NodeMover = require('./modules/NodeMover').NodeMover;
var PixiGraphics = require('./modules/PixiGraphics').PixiGraphics;

module.exports.main = function () {
    var _layoutIterations = 1000;
    var _layoutStepsPerMessage = 25;

    //--simple frame-rate display for renders vs layouts
    var _counts = {renders: 0, layouts: 0, renderRate: 0, layoutRate: 0};
    var $info = $('<div>').appendTo('body');
    var startTime = new Date();

    var _updateInfo = function () {
        var endTime = new Date();
        var timeDiff = (endTime - startTime) / 1000;

        if (_counts.layouts < _layoutIterations) {
            _counts.layoutRate = _counts.layouts / timeDiff;
        }
        _counts.renderRate = _counts.renders / timeDiff;
        $info.text('Renders: ' + _counts.renders + ' (' + Math.round(_counts.renderRate) + ') | Layouts: ' + _counts.layouts + ' (' + Math.round(_counts.layoutRate) + ')');
    };

    var _nodeMovers = {};

    $.getJSON('data/graph.json', function (jsonData) {
        jsonData.nodes.forEach(function (node, i) {
            var nodeMover = new NodeMover();
            nodeMover.data('id', node.id);
            _nodeMovers[node.id] = nodeMover;
        });

        var _layoutPositions = {};
        w.addEventListener('message', function (ev) {
            _layoutPositions = ev.data;
            _counts.layouts = _layoutPositions.i;
        });
        w.postMessage({jsonData: jsonData, iterations: _layoutIterations, stepsPerMessage: _layoutStepsPerMessage}); // when the worker is ready, kick things off

        var graphics = new PixiGraphics(0.75, jsonData, function () {
            $.each(_nodeMovers, function (id, nodeMover) {
                if (_layoutPositions.nodePositions) {
                    nodeMover.position(_layoutPositions.nodePositions[id]);
                    nodeMover.animate();
                }
            });
            return _nodeMovers;
        });

        function renderFrame() {
            graphics.renderFrame();
            _counts.renders++;
            _updateInfo();
            requestAnimFrame(renderFrame);
        }

        // begin animation loop:
        renderFrame();
    });
};