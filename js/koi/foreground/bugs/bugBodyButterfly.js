/**
 * A butterfly body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterfly = function(gl) {
    BugBody.call(
        this,
        gl,
        new Vector2(this.FLEX, 0),
        this.FLEX_ANGLE,
        [
            0, 0, 0, 0, 1, 0, 0, 1,
            .3, -.3, .1, -.3, 1, 1, 0, .2,
            .3, .3, .1, .3, 1, 0, 1, .2,
            -.3, -.3, -.1, -.3, 1, 1, 0, 1.8,
            -.3, .3, -.1, .3, 1, 0, 1, 1.8
        ],
        [
            0, 1, 2,
            0, 3, 4
        ]);
};

BugBodyButterfly.prototype = Object.create(BugBody.prototype);
BugBodyButterfly.prototype.FLEX = .2;
BugBodyButterfly.prototype.FLEX_ANGLE = -.6;