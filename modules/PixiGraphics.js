//region npm modules

//endregion
//region modules

//endregion

/**
 @class PixiGraphics
 */
PixiGraphics = function (scale, graphData, layoutFn) {
    var _self = this;

    //region private fields and methods
    var _graphics;
    var _renderer;
    var _stage;

    var _init = function () {
        var width = window.innerWidth,
            height = window.innerHeight;

        _stage = new PIXI.Stage(0x666666, true);
        _stage.setInteractive(true);

        _renderer = PIXI.autoDetectRenderer(width, height, null, false, true);
        _renderer.view.style.display = "block";
        document.body.appendChild(_renderer.view);

        _graphics = new PIXI.Graphics();
        _graphics.position.x = width / 2;
        _graphics.position.y = height / 2;
        _graphics.scale.x = scale;
        _graphics.scale.y = scale;
        _stage.addChild(_graphics);
    };

    var _toRGB = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    var _toDecColor = function (color) {
        return (color.r << 16) + (color.g << 8) + (color.b);
    };

    var _edges = graphData.edges;
    var _nodesById = {};

    $.each(graphData.nodes, function (i, node) {
        _nodesById[node.id] = node;
        node.decColor = _toDecColor(_toRGB(node.color));
    });

    var _drawGraph = function (graphics, nodeMovers) {
        // No magic at all: Iterate over positions array and render nodes/links
        graphics.clear();
        var i, x, y, x1, y1;

        graphics.lineStyle(5, 0x3300FF, 0.25);
        $.each(_edges, function (i, edge) {
            var sourcePos = nodeMovers[edge.source].renderPosition();
            var targetPos = nodeMovers[edge.target].renderPosition();

            graphics.moveTo(sourcePos.x, sourcePos.y);
            graphics.lineTo(targetPos.x, targetPos.y);
        });

        $.each(_edges, function (i, edge) {
            var sourcePos = nodeMovers[edge.source].renderPosition();
            var targetPos = nodeMovers[edge.target].renderPosition();

            graphics.lineStyle(2, _nodesById[edge.source].decColor, 0.85);

            graphics.moveTo(sourcePos.x, sourcePos.y);
            graphics.lineTo(targetPos.x, targetPos.y);
        });

        graphics.lineStyle(4, 0x3300FF, 0.25);
        $.each(nodeMovers, function (i, nodeMover) {
            var node = _nodesById[nodeMover.data('id')];
            graphics.beginFill(node.decColor);
            var pos = nodeMover.renderPosition();
            var r = nodeMover.radius();

            if (node.shape === 'circle') {
                graphics.drawCircle(pos.x, pos.y, r);
            } else {
                x = pos.x - r / 2;
                y = pos.y - r / 2;
                graphics.drawRect(x, y, r, r);//not really radius, but we want smaller rectangles here...
            }
        });
    };
    //endregion

    //region public API
    this.renderFrame = function () {
        var nodeMovers = layoutFn();
        if (nodeMovers) {
            _drawGraph(_graphics, nodeMovers);
        }
        _renderer.render(_stage);
    };
    //endregion

    _init();
};

module.exports.PixiGraphics = PixiGraphics;

