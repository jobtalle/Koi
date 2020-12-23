/**
 * A butterfly body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Color} colorWings The wing color
 * @constructor
 */
const BugBodyButterfly = function(
    gl,
    colorWings) {
    const vertices = [];
    const indices = [];

    this.model(
        vertices,
        indices,
        colorWings);

    BugBody.call(
        this,
        gl,
        new Vector2(this.FLEX, 0),
        this.FLEX_ANGLE,
        this.SPEED,
        this.ROTATION,
        vertices,
        indices);
};

BugBodyButterfly.prototype = Object.create(BugBody.prototype);
BugBodyButterfly.prototype.STEPS = 9;
BugBodyButterfly.prototype.FLEX = .2;
BugBodyButterfly.prototype.FLEX_ANGLE = -.6;
BugBodyButterfly.prototype.SPEED = new SamplerPower(.002, .08, .38);
BugBodyButterfly.prototype.ROTATION = new Sampler(-1.7, 1.7);
BugBodyButterfly.prototype.FLAP_SPEED_FLYING = .5;
BugBodyButterfly.prototype.FLAP_SPEED_IDLE = .05;
BugBodyButterfly.prototype.WING_SHADE = -.35;
BugBodyButterfly.prototype.WING_HIGHLIGHT = .35;

/**
 * Model the butterfly
 * @param {Number[]} vertices The array to store the vertices in
 * @param {Number[]} indices The array to store the indices in
 * @param {Color} colorWings The wing color
 */
BugBodyButterfly.prototype.model = function(
    vertices,
    indices,
    colorWings) {
    const flapScale = .2;
    const sample = new Vector2();
    const bezier = new CubicBezier(
        new Vector2(0, -.05),
        new Vector2(.2, -.4),
        new Vector2(.3, .4),
        new Vector2(0, .05));

    for (let step = 0; step < this.STEPS; ++step) {
        const t = step / (this.STEPS - 1);

        bezier.sample(sample, t);

        vertices.push(
            sample.x, sample.y,
            sample.x * flapScale, sample.y,
            colorWings.r, colorWings.g, colorWings.b,
            this.WING_SHADE,
            -sample.x, sample.y,
            -sample.x * flapScale, sample.y,
            colorWings.r, colorWings.g, colorWings.b,
            this.WING_HIGHLIGHT);
        indices.push(
            0, step << 1, step + 1 << 1,
            1, (step << 1) + 1, (step + 1 << 1) + 1);
    }
};

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