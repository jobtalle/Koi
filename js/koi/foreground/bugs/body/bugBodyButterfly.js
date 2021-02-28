/**
 * A butterfly body
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Sampler} bodyHeightSampler The height of the body
 * @param {Sampler} topLengthSampler The distance to the top left control point
 * @param {Sampler} topAngleSampler The angle towards the top left control
 * @param {Sampler} bottomLengthSampler The distance to the bottom left control point
 * @param {Sampler} bottomAngleSampler The angle towards the top left control point
 * @param {Color} colorWings The wing color
 * @param {Color} colorWingsEdge The wing edge color
 * @param {Boolean} resistant True if the bug resists rain
 * @param {Sampler} speed The flying speed sampler
 * @param {Random} random A randomizer
 * @constructor
 */
const BugBodyButterfly = function(
    gl,
    bodyHeightSampler,
    topLengthSampler,
    topAngleSampler,
    bottomLengthSampler,
    bottomAngleSampler,
    colorWings,
    colorWingsEdge,
    resistant,
    speed,
    random) {
    const vertices = [];
    const indices = [];

    this.model(
        vertices,
        indices,
        bodyHeightSampler.sample(random.getFloat()),
        topLengthSampler.sample(random.getFloat()),
        topAngleSampler.sample(random.getFloat()),
        bottomLengthSampler.sample(random.getFloat()),
        bottomAngleSampler.sample(random.getFloat()),
        colorWings,
        colorWingsEdge);

    BugBody.call(
        this,
        gl,
        new Vector2(this.FLEX, 0),
        this.FLEX_ANGLE,
        speed,
        this.ROTATION,
        resistant,
        vertices,
        indices);

    this.skipFlap = 0;
};

BugBodyButterfly.prototype = Object.create(BugBody.prototype);
BugBodyButterfly.prototype.STEPS = 9;
BugBodyButterfly.prototype.FLEX = .2;
BugBodyButterfly.prototype.FLEX_ANGLE = -.6;
BugBodyButterfly.prototype.ROTATION = new SamplerPlateau(-Math.PI, 0, Math.PI, 1);
BugBodyButterfly.prototype.FLAP_SPEED_FLYING = .6;
BugBodyButterfly.prototype.FLAP_SPEED_IDLE = .035;
BugBodyButterfly.prototype.FLAP_SPEED_SKIP = .3;
BugBodyButterfly.prototype.FLAP_SCALE = .2;
BugBodyButterfly.prototype.WING_SHADE = -.35;
BugBodyButterfly.prototype.WING_HIGHLIGHT = .35;
BugBodyButterfly.prototype.SKIP_CHANCE = .25;
BugBodyButterfly.prototype.SKIP_STEPS = new Sampler(1, 3);

/**
 * Model the butterfly
 * @param {Number[]} vertices The array to store the vertices in
 * @param {Number[]} indices The array to store the indices in
 * @param {Number} bodyHeight The height of the body
 * @param {Number} topLength The distance to the top left control point
 * @param {Number} topAngle The angle towards the top left control
 * @param {Number} bottomLength The distance to the bottom left control point
 * @param {Number} bottomAngle The angle towards the top left control point
 * @param {Color} colorWings The wing color
 * @param {Color} colorWingsEdge The wing edge color
 */
BugBodyButterfly.prototype.model = function(
    vertices,
    indices,
    bodyHeight,
    topLength,
    topAngle,
    bottomLength,
    bottomAngle,
    colorWings,
    colorWingsEdge) {
    const sample = new Vector2();

    const path = new Path2CubicBezier(
        new Vector2(
            0,
            bodyHeight * .5),
        new Vector2(
            Math.cos(topAngle) * topLength,
            bodyHeight * -.5 + Math.sin(topAngle) * topLength),
        new Vector2(
            Math.cos(bottomAngle) * bottomLength,
            bodyHeight * -.5 + Math.sin(bottomAngle) * bottomLength),
        new Vector2(
            0,
            bodyHeight * -.5));

    for (let step = 0; step < this.STEPS; ++step) {
        const color = step === 0 || step === this.STEPS - 1 ? colorWings : colorWingsEdge;
        const t = step / (this.STEPS - 1);

        path.sample(sample, t);

        vertices.push(
            sample.x, sample.y,
            sample.x * this.FLAP_SCALE, sample.y,
            color.r, color.g, color.b,
            this.WING_SHADE,
            -sample.x, sample.y,
            -sample.x * this.FLAP_SCALE, sample.y,
            color.r, color.g, color.b,
            this.WING_HIGHLIGHT);

        if (step !== this.STEPS - 1)
            indices.push(
                0, step << 1, step + 1 << 1,
                1, (step << 1) + 1, (step + 1 << 1) + 1);
    }
};

/**
 * Update the bug body
 * @param {Boolean} idle True if the bug is currently idle
 * @param {Random} random A randomizer
 */
BugBodyButterfly.prototype.update = function(idle, random) {
    BugBody.prototype.update.call(this, idle);

    if (idle) {
        if (this.skipFlap !== 0) {
            this.flap += this.FLAP_SPEED_SKIP;

            if (this.flap > 1) {
                --this.flap;
                --this.skipFlap;
            }
        }
        else {
            this.flap += this.FLAP_SPEED_IDLE;

            if (this.flap > 1) {
                --this.flap;

                if (random.getFloat() < this.SKIP_CHANCE)
                    this.skipFlap = Math.round(this.SKIP_STEPS.sample(random.getFloat()));
            }
        }
    }
    else {
        this.flap += this.FLAP_SPEED_FLYING;

        if (this.flap > 1)
            --this.flap;
    }
};