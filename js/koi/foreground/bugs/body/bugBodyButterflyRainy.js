/**
 * A rainy weather butterfly
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterflyRainy = function(gl, random) {
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
        random);
};

BugBodyButterflyRainy.prototype = Object.create(BugBodyButterfly.prototype);
BugBodyButterflyRainy.prototype.COLOR_WINGS = Color.fromCSS("--color-bug-butterfly-blue");
BugBodyButterflyRainy.prototype.COLOR_WINGS_EDGE = Color.fromCSS("--color-bug-butterfly-blue-edge");
BugBodyButterflyRainy.prototype.SAMPLER_BODY_HEIGHT = new SamplerPower(.07, .08, 2);
BugBodyButterflyRainy.prototype.SAMPLER_TOP_LENGTH = new SamplerPower(.6, .66, 2);
BugBodyButterflyRainy.prototype.SAMPLER_TOP_ANGLE = new Sampler(Math.PI * .29, Math.PI * .35);
BugBodyButterflyRainy.prototype.SAMPLER_BOTTOM_LENGTH = new SamplerPower(.46, .5, 2);
BugBodyButterflyRainy.prototype.SAMPLER_BOTTOM_ANGLE = new Sampler(Math.PI * -.39, Math.PI * -.46);