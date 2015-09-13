//region npm modules

//endregion
//region modules

//endregion

/**
 @class AnimationHelper
 */
AnimationHelper = function () {
    var _self = this;

    //region private fields and methods
    /** @type {Number} */
    var _stepsToCatchUp = 20;
    /** @type {Number} */
    var _maxDist = 10;

    var _init = function () {
    };

    var _approachTarget = function (targetVal, currentVal) {
        if (targetVal == null || isNaN(targetVal)) {
            return currentVal;
        }
        if (currentVal == null || isNaN(currentVal)) {
            return targetVal;
        }
        var tol = Math.max(0.000001, Math.abs(targetVal / 10000));//base tolerance on size of target...
        var diff = (targetVal - currentVal);
        if (Math.abs(diff) < tol) return targetVal;
        var dist = diff / _stepsToCatchUp;
        if (dist > _maxDist) {
            dist = _maxDist;
        }
        if (dist < -_maxDist) {
            dist = -_maxDist;
        }
        return currentVal + dist;
    };

    var _updateObj = function (obj, valObj) {
        Object.keys(valObj).forEach(function (k) {
            var value = valObj[k];
            if (obj[k] !== value) {
                obj[k] = value;
            }
        });
    };

    var _updateIfChanged = function (state, targetState) {
        var cState = {};
        Object.keys(state).forEach(function (k) {
            cState[k] = state[k];
        });
        var hasChange = false;
        if (targetState == null) {
            var foo = 1;
        } else {
            Object.keys(targetState).forEach(function (k) {
                var value = targetState[k];
                if (typeof value === 'object') {
                    hasChange = hasChange || _updateIfChanged(cState[k], value);
                } else {
                    if (value !== cState[k]) {
                        hasChange = true;
                        cState[k] = _approachTarget(value, cState[k]);
                    }
                }
            });
        }
        _updateObj(state, cState);
        return hasChange;
    };

    //endregion

    this.p_this = function () {
        return _self;
    };

    //region public API
    this.applyChanges = function (obj, valObj) {
        _updateObj(obj, valObj);
    };

    this.updateIfChanged = function (state, targetState) {
        return _updateIfChanged(state, targetState);
    };

    /**
     * @param {Number} [maxDist]
     * @return {Number|AnimationHelper}
     */
    this.maxDist = function (maxDist) {
        if (!arguments.length) {
            return _maxDist;
        }
        _maxDist = maxDist;
        return _self.p_this();
    };

    /**
     * @param {Number} [stepsToCatchUp]
     * @return {Number|AnimationHelper}
     */
    this.stepsToCatchUp = function (stepsToCatchUp) {
        if (!arguments.length) {
            return _stepsToCatchUp;
        }
        _stepsToCatchUp = stepsToCatchUp;
        return _self.p_this();
    };
    //endregion

    _init();
};

module.exports.AnimationHelper = AnimationHelper;

