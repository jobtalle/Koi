/**
 * The rocky terrain surrounding the ponds
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Rocks = function(gl, constellation, random) {
    this.mesh = this.createMesh(gl, constellation, random);
};

/**
 * A plan for a rock to be placed
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} radius The radius
 * @constructor
 */
Rocks.Plan = function(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};

Rocks.prototype.COLOR_TOP = Color.fromCSS("rock-top");
Rocks.prototype.COLOR_SIDE = Color.fromCSS("rock-side");
Rocks.prototype.PILLAR_RESOLUTION = .15;
Rocks.prototype.PILLAR_RADIUS_MIN = .1;
Rocks.prototype.PILLAR_RADIUS_MAX = .6;
Rocks.prototype.PILLAR_RADIUS_POWER = 1.2;
Rocks.prototype.PILLAR_SPACING_MIN = 1;
Rocks.prototype.PILLAR_SPACING_MAX = 1.7;
Rocks.prototype.PILLAR_HEIGHT_MIN = 1;
Rocks.prototype.PILLAR_HEIGHT_MAX = 2;
Rocks.prototype.PILLAR_SHIFT_AMPLITUDE = .06;
Rocks.prototype.NOISE_SCALE = .7;
Rocks.prototype.NOISE_THRESHOLD = .36;

/**
 * Create the rocks mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 */
Rocks.prototype.createMesh = function(gl, constellation, random) {
    const noise = new CubicNoise(
        Math.ceil(constellation.width * this.NOISE_SCALE),
        Math.ceil(constellation.height * this.NOISE_SCALE),
        random);
    const vertices = [];
    const indices = [];
    const plans = [];

    this.planArc(
        plans,
        constellation.big.constraint.position.x,
        constellation.big.constraint.position.y,
        constellation.big.constraint.radius,
        0,
        Math.PI * 2,
        0,
        constellation.width,
        0,
        constellation.height,
        noise,
        random);

    this.planArc(
        plans,
        constellation.small.constraint.position.x,
        constellation.small.constraint.position.y,
        constellation.small.constraint.radius,
        0,
        Math.PI * 2,
        0,
        constellation.width,
        0,
        constellation.height,
        noise,
        random);

    for (const arc of constellation.river.constraint.arcs) {
        this.planArc(
            plans,
            arc.center.x,
            arc.center.y,
            arc.radius - constellation.river.constraint.width * .5,
            arc.start,
            arc.end,
            0,
            constellation.width,
            0,
            constellation.height,
            noise,
            random);

        this.planArc(
            plans,
            arc.center.x,
            arc.center.y,
            arc.radius + constellation.river.constraint.width * .5,
            arc.start,
            arc.end,
            0,
            constellation.width,
            0,
            constellation.height,
            noise,
            random);
    }

    plans.sort((a, b) => b.y - a.y);

    // TODO: Cull rocks outside view
    for (const plan of plans)
        this.createPillar(
            vertices,
            indices,
            plan.x,
            plan.y,
            plan.radius,
            plan.radius *
                (this.PILLAR_HEIGHT_MIN + (this.PILLAR_HEIGHT_MAX - this.PILLAR_HEIGHT_MIN) * random.getFloat()));
    
    return new Mesh(gl, vertices, indices);
};

/**
 * Plan an arc of rocks
 * @param {Rocks.Plan[]} plans The array of plans to append
 * @param {Number} x The arc X center
 * @param {Number} y The arc Y center
 * @param {Number} radius The arc radius
 * @param {Number} start The arc start in radians
 * @param {Number} end The arc end in radians
 * @param {Number} xMin The minimum X position
 * @param {Number} xMax The maximum X position
 * @param {Number} yMin The minimum Y position
 * @param {Number} yMax The maximum Y position
 * @param {CubicNoise} noise The rock intensity noise
 * @param {Random} random A randomizer
 */
Rocks.prototype.planArc = function(
    plans,
    x,
    y,
    radius,
    start,
    end,
    xMin,
    xMax,
    yMin,
    yMax,
    noise,
    random) {
    const circumference = Math.PI * 2 * radius;
    let radiansLeft = end - start;

    for (let radians = start; radiansLeft > 0;) {
        const shift = (random.getFloat() * 2 - 1) * this.PILLAR_SHIFT_AMPLITUDE;
        const rockX = x + Math.cos(radians) * (radius + shift);
        const rockY = y + Math.sin(radians) * (radius + shift);
        let intensity;

        if (rockX < xMin ||
            rockX > xMax ||
            rockY < yMin ||
            rockY > yMax ||
            (intensity = noise.sample(
                rockX * this.NOISE_SCALE,
                rockY * this.NOISE_SCALE)) < this.NOISE_THRESHOLD) {
            radians += this.PILLAR_RADIUS_MIN;
            radiansLeft -= this.PILLAR_RADIUS_MIN;

            continue;
        }

        intensity = (intensity - this.NOISE_THRESHOLD) / (1 - this.NOISE_THRESHOLD);

        const rockRadius = this.PILLAR_RADIUS_MIN +
            (this.PILLAR_RADIUS_MAX - this.PILLAR_RADIUS_MIN) *
            Math.pow(random.getFloat(), this.PILLAR_RADIUS_POWER) * intensity;
        const radiansStep = Math.PI * 2 * rockRadius / circumference *
            (this.PILLAR_SPACING_MIN + (this.PILLAR_SPACING_MAX - this.PILLAR_SPACING_MIN) * random.getFloat());

        plans.push(new Rocks.Plan(rockX, rockY, rockRadius));

        radians += radiansStep;
        radiansLeft -= radiansStep;
    }
};

/**
 * Model a pillar
 * @param {Number[]} vertices The vertices
 * @param {Number[]} indices The indices
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 * @param {Number} radius The pillar radius
 * @param {Number} height The pillar height
 */
Rocks.prototype.createPillar = function(
    vertices,
    indices,
    x,
    y,
    radius,
    height) {
    const top = 1.1;
    const squish = .65;
    const firstIndex = vertices.length / 7;
    const precision = Math.ceil(2 * Math.PI * radius / this.PILLAR_RESOLUTION);
    const zShift = (-.5 + random.getFloat()) * .5;
    const lightTop = .8 - zShift * .4;
    let lastStep = precision - 1;
    // TODO: Skip back faces

    for (let step = 0; step < precision; ++step) {
        const radians = Math.PI * 2 * step / precision;
        const dx = Math.cos(radians) * radius;
        const dy = Math.sin(radians) * radius * squish;
        const l = Math.sqrt(dx * dx + dy * dy);
        const lx = 1 / Math.sqrt(2);
        const ly = 1 / Math.sqrt(2);
        const nx = dx / l;
        const ny = dy / l;
        const baseLight = 1;
        const ambient = .6;
        const light = ambient + (1 - ambient) * Math.max(0, nx * lx + ny * ly);

        vertices.push(
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            light * baseLight,
            x + dx,
            y + dy,
            0,
            this.COLOR_SIDE.r,
            this.COLOR_SIDE.g,
            this.COLOR_SIDE.b,
            light,
            x + dx * top,
            y + dy * top,
            height + dx * zShift * top,
            this.COLOR_TOP.r,
            this.COLOR_TOP.g,
            this.COLOR_TOP.b,
            lightTop,
            x + dx * top,
            y + dy * top,
            height + dx * zShift * top);
        indices.push(
            firstIndex + lastStep * 3,
            firstIndex + lastStep * 3 + 1,
            firstIndex + step * 3 + 1,
            firstIndex + step * 3 + 1,
            firstIndex + step * 3,
            firstIndex + lastStep * 3,
            firstIndex + precision * 3,
            firstIndex + lastStep * 3 + 2,
            firstIndex + step * 3 + 2);

        lastStep = step;
    }

    vertices.push(
        this.COLOR_TOP.r,
        this.COLOR_TOP.g,
        this.COLOR_TOP.b,
        lightTop,
        x,
        y,
        height);
};

/**
 * Render the rocks
 * @param {Stone} stone The stone renderer
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Rocks.prototype.render = function(stone, width, height, scale) {
    stone.render(width, height, scale);
};

/**
 * Free all resources maintained by this object
 */
Rocks.prototype.free = function() {
    this.mesh.free();
};