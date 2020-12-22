/**
 * A butterfly body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const BugBodyButterfly = function(gl) {
    const vertices = [];
    const indices = [];

    this.model(vertices, indices);

    BugBody.call(
        this,
        gl,
        new Vector2(this.FLEX, 0),
        this.FLEX_ANGLE,
        this.SPEED,
        vertices,
        indices);
};

BugBodyButterfly.prototype = Object.create(BugBody.prototype);
BugBodyButterfly.prototype.STEPS = 9;
BugBodyButterfly.prototype.FLEX = .2;
BugBodyButterfly.prototype.FLEX_ANGLE = -.6;
BugBodyButterfly.prototype.SPEED = new SamplerPower(.002, .08, .38);
BugBodyButterfly.prototype.FLAP_SPEED_FLYING = .41;
BugBodyButterfly.prototype.FLAP_SPEED_IDLE = .05;

/**
 * Model the butterfly
 * @param {Number[]} vertices The array to store the vertices in
 * @param {Number[]} indices The array to store the indices in
 */
BugBodyButterfly.prototype.model = function(vertices, indices) {
    const shade = -.3;
    const highlight = .3;
    const flapScale = .2;
    const color = new Color(1, .9, .9);
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
            color.r, color.g, color.b,
            shade);
        vertices.push(
            -sample.x, sample.y,
            -sample.x * flapScale, sample.y,
            color.r, color.g, color.b,
            highlight);
        indices.push(0, step << 1, step + 1 << 1);
        indices.push(1, (step << 1) + 1, (step + 1 << 1) + 1);
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