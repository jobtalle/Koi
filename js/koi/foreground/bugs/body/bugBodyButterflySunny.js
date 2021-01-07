/**
 * A sunny weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterflySunny = function(gl, random) {
    BugBodyButterfly.call(
        this,
        gl,
        this.SAMPLER_BODY_HEIGHT,
        this.SAMPLER_TOP_LENGTH,
        this.SAMPLER_TOP_ANGLE,
        this.SAMPLER_BOTTOM_LENGTH,
        this.SAMPLER_BOTTOM_ANGLE,
        this.COLOR_WINGS,
        this.COLOR_WINGS_EDGE,
        false,
        this.SPEED,
        random);
};

BugBodyButterflySunny.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflySunny.prototype.SPEED = new SamplerPower(.002, .08, .38);
BugBodyButterflySunny.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-yellow");
BugBodyButterflySunny.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-yellow-edge");
BugBodyButterflySunny.prototype.SAMPLER_BODY_HEIGHT = new SamplerPower(.04, .05, 2);
BugBodyButterflySunny.prototype.SAMPLER_TOP_LENGTH = new SamplerPower(.31, .36, 2);
BugBodyButterflySunny.prototype.SAMPLER_TOP_ANGLE = new Sampler(Math.PI * .25, Math.PI * .29);
BugBodyButterflySunny.prototype.SAMPLER_BOTTOM_LENGTH = new SamplerPower(.2, .25, 2);
BugBodyButterflySunny.prototype.SAMPLER_BOTTOM_ANGLE = new Sampler(Math.PI * -.35, Math.PI * -.4);