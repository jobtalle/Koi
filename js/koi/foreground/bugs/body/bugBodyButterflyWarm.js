/**
 * A sunny weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterflyWarm = function(gl, random) {
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

BugBodyButterflyWarm.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyWarm.prototype.SPEED = new SamplerPower(.001, .09, .38);
BugBodyButterflyWarm.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-orange");
BugBodyButterflyWarm.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-orange-edge");
BugBodyButterflyWarm.prototype.SAMPLER_BODY_HEIGHT = new SamplerPower(.045, .055, 2);
BugBodyButterflyWarm.prototype.SAMPLER_TOP_LENGTH = new SamplerPower(.34, .39, 2);
BugBodyButterflyWarm.prototype.SAMPLER_TOP_ANGLE = new Sampler(Math.PI * .3, Math.PI * .35);
BugBodyButterflyWarm.prototype.SAMPLER_BOTTOM_LENGTH = new SamplerPower(.25, .27, 2);
BugBodyButterflyWarm.prototype.SAMPLER_BOTTOM_ANGLE = new Sampler(Math.PI * -.34, Math.PI * -.39);