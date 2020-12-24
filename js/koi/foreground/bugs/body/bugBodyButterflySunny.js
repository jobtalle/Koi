/**
 * A sunny weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterflySunny = function(gl) {
    BugBodyButterfly.call(
        this,
        gl,
        this.COLOR_WINGS,
        this.COLOR_WINGS_EDGE);
};

BugBodyButterflySunny.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflySunny.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-yellow");
BugBodyButterflySunny.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-yellow-edge");