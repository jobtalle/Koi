/**
 * A rare thunder butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterflyThunder = function(gl) {
    BugBodyButterfly.call(
        this,
        gl,
        this.COLOR_WINGS,
        this.COLOR_WINGS_EDGE);
};

BugBodyButterflyThunder.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyThunder.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-thunder");
BugBodyButterflyThunder.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-thunder-edge");