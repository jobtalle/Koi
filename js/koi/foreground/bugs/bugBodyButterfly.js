/**
 * A butterfly body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterfly = function(gl) {
    BugBody.call(
        this,
        gl,
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