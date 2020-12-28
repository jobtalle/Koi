/**
 * A rare thunder butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterflyThunder = function(gl, random) {
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

BugBodyButterflyThunder.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyThunder.prototype.SPEED = new SamplerPower(.002, .11, .38);
BugBodyButterflyThunder.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-thunder");
BugBodyButterflyThunder.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-thunder-edge");
BugBodyButterflyThunder.prototype.SAMPLER_BODY_HEIGHT = new SamplerPower(.05, .06, 2);
BugBodyButterflyThunder.prototype.SAMPLER_TOP_LENGTH = new SamplerPower(.55, .62, 2);
BugBodyButterflyThunder.prototype.SAMPLER_TOP_ANGLE = new Sampler(Math.PI * .28, Math.PI * .34);
BugBodyButterflyThunder.prototype.SAMPLER_BOTTOM_LENGTH = new SamplerPower(.4, .45, 2);
BugBodyButterflyThunder.prototype.SAMPLER_BOTTOM_ANGLE = new Sampler(Math.PI * -.38, Math.PI * -.44);