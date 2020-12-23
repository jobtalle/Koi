/**
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterflyYellow = function(gl) {
    BugBodyButterfly.call(
        this,
        gl,
        this.COLOR_WINGS);
};

BugBodyButterflyYellow.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyYellow.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-yellow");