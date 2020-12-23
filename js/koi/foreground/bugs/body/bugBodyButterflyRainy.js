/**
 * A rainy weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterflyRainy = function(gl) {
    BugBodyButterfly.call(
        this,
        gl,
        this.COLOR_WINGS,
        this.COLOR_WINGS_EDGE);
};

BugBodyButterflyRainy.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyRainy.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-blue");
BugBodyButterflyRainy.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-blue-edge");