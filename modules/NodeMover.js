//region npm modules

//endregion
//region modules
var AnimHelper = require('./AnimationHelper').AnimationHelper;
//endregion

/**
 @class NodeMover
 */
NodeMover = function () {
    var _self = this;

    //region private fields and methods

    /** @type {Object} */
    var _currentState;
    /** @type {Object} */
    var _targetState = {
        alpha: 1,
        position: {x: 0, y: 0},
        radius: 10
    };

    /** @type {Object} */
    var _data = {};

    var _animHelper = new AnimHelper();

    var _init = function () {
        _currentState = JSON.parse(JSON.stringify(_targetState));
    };

    //endregion

    this.p_this = function () {
        return _self;
    };

    //region public API
    this.renderPosition = function () {
       return _currentState.position;
    };

    /**
     * @param {Object} [position]
     * @return {Object|NodeMover}
     */
    this.position = function (position) {
        if (!arguments.length) {
            return _targetState.position;
        }
        _targetState.position = position;
        return _self.p_this();
    };

    /**
     * @param {Number} [radius]
     * @return {Number|NodeMover}
     */
    this.radius = function (radius) {
        if (!arguments.length) {
            return _targetState.radius;
        }
        _targetState.radius = radius;
        return _self.p_this();
    };

    this.animate = function () {
        var changes = _animHelper.updateIfChanged(_currentState, _targetState);
    };

    /**
     * @param {String} prop
     * @param {Object} [data]
     * @return {Object|NodeMover}
     */
    this.data = function (prop, data) {
        if (!arguments.length) throw 'Data property must be specified';
        if (arguments.length === 1) {
            return _data[prop];
        }
        _data[prop] = data;
        return _self.p_this();
    };

    //endregion

    _init();
};

module.exports.NodeMover = NodeMover;

