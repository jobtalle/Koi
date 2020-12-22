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
        this.SPEED,
        [
            0, 0, 0, 0, 1, 0, 0, 1,
            .3, -.3, .05, -.3, 1, 1, 0, .2,
            .3, .3, .05, .3, 1, 0, 1, .2,
            -.3, -.3, -.05, -.3, 1, 1, 0, 1.8,
            -.3, .3, -.05, .3, 1, 0, 1, 1.8
        ],
        [
            0, 1, 2,
            0, 3, 4
        ]);
};

BugBodyButterfly.prototype = Object.create(BugBody.prototype);
BugBodyButterfly.prototype.FLEX = .2;
BugBodyButterfly.prototype.FLEX_ANGLE = -.6;
BugBodyButterfly.prototype.SPEED = new SamplerPower(.005, .08, .3);
BugBodyButterfly.prototype.FLAP_SPEED_FLYING = .41;
BugBodyButterfly.prototype.FLAP_SPEED_IDLE = .05;

/**
 * Update the bug body
 * @param {Boolean} idle True if the bug is currently idle
 */
BugBodyButterfly.prototype.update = function(idle) {
    BugBody.prototype.update.call(this, idle);

    if (idle)
        this.flap += this.FLAP_SPEED_IDLE;
    else
        this.flap += this.FLAP_SPEED_FLYING;

    if (this.flap > 1)
        this.flap -= 1;
};