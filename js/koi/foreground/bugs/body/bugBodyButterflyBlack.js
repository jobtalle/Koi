/**
 * A rainy weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterflyBlack = function(gl, random) {
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
        true,
        this.SPEED,
        random);
};

BugBodyButterflyBlack.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyBlack.prototype.SPEED = new SamplerPower(.002, .09, .38);
BugBodyButterflyBlack.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-black");
BugBodyButterflyBlack.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-black-edge");
BugBodyButterflyBlack.prototype.SAMPLER_BODY_HEIGHT = new SamplerPower(.06, .07, 2);
BugBodyButterflyBlack.prototype.SAMPLER_TOP_LENGTH = new SamplerPower(.45, .5, 2);
BugBodyButterflyBlack.prototype.SAMPLER_TOP_ANGLE = new Sampler(Math.PI * .26, Math.PI * .32);
BugBodyButterflyBlack.prototype.SAMPLER_BOTTOM_LENGTH = new SamplerPower(.32, .37, 2);
BugBodyButterflyBlack.prototype.SAMPLER_BOTTOM_ANGLE = new Sampler(Math.PI * -.36, Math.PI * -.41);