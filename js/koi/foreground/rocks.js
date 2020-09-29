/**
 * The rocky terrain surrounding the ponds
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Slots} slots The slots to place objects on
 * @param {Number} yScale The Y projection scale in the range [0, 1]
 * @param {Biome} biome The biome
 * @param {Random} random A randomizer
 * @constructor
 */
const Rocks = function(
    gl,
    constellation,
    slots,
    yScale,
    biome,
    random) {
    this.mesh = this.createMesh(gl, constellation, slots, yScale, biome, random); // TODO: Omit back faces
};

/**
 * A plan for a rock to be placed
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} radius The radius
 * @param {Number} height The height
 * @constructor
 */
Rocks.Plan = function(x, y, radius, height) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.height = height;
};

Rocks.prototype.COLOR_TOP = Color.fromCSS("--color-rock-top");
Rocks.prototype.COLOR_SIDE = Color.fromCSS("--color-rock-side");
Rocks.prototype.STRIDE = 6;
Rocks.prototype.PILLAR_RESOLUTION = .15;
Rocks.prototype.PILLAR_RADIUS_MIN = .11;
Rocks.prototype.PILLAR_RADIUS_MAX = .4;
Rocks.prototype.PILLAR_RADIUS_POWER = 1.5;
Rocks.prototype.PILLAR_SPACING_MIN = 1.2;
Rocks.prototype.PILLAR_SPACING_MAX = 1.6;
Rocks.prototype.PILLAR_HEIGHT_MIN = 1;
Rocks.prototype.PILLAR_HEIGHT_MAX = 2;
Rocks.prototype.PILLAR_HEIGHT_DELTA = .07;
Rocks.prototype.PILLAR_SHIFT_AMPLITUDE = .06;
Rocks.prototype.PILLAR_SKEW = 1.18;
Rocks.prototype.PILLAR_LIGHT_AMBIENT = .6;
Rocks.prototype.PILLAR_LIGHT_BASE = .8;

/**
 * Create the rocks mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Slots} slots The slots to place objects on
 * @param {Number} yScale The Y projection scale in the range [0, 1]
 * @param {Biome} biome The biome
 * @param {Random} random A randomizer
 */
Rocks.prototype.createMesh = function(
    gl,
    constellation,
    slots,
    yScale,
    biome,
    random) {
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
        biome.sampleRocksPonds.bind(biome),
        slots,
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
        biome.sampleRocksPonds.bind(biome),
        slots,
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
            biome.sampleRocksRiver.bind(biome),
            slots,
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
            biome.sampleRocksRiver.bind(biome),
            slots,
            random);
    }

    plans.sort((a, b) => b.y - a.y);

    for (const plan of plans) {
        this.createPillar(
            vertices,
            indices,
            plan.x,
            plan.y,
            plan.radius,
            plan.height,
            yScale,
            random);

        slots.clearOval(
            plan.x,
            plan.y,
            plan.radius * this.PILLAR_SKEW,
            plan.radius * yScale * this.PILLAR_SKEW);
    }

    new MeshNormalizer(
        constellation.width,
        constellation.height,
        this.STRIDE,
        [3],
        [4],
        [],
        [5]).apply(vertices);

    return new Mesh(gl, new MeshData(vertices, indices), this.getFirstIndex(vertices) - 1 > 0xFFFF);
};

/**
 * Get the first index of a new mesh in the vertex array
 * @param {Number[]} vertices The vertex array
 * @returns {Number} The first index of vertices that will be added to the array
 */
Rocks.prototype.getFirstIndex = function(vertices) {
    return vertices.length / this.STRIDE;
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
 * @param {Function} sampler The rock intensity sampler
 * @param {Slots} slots The slots to place objects on
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
    sampler,
    slots,
    random) {
    const circumference = Math.PI * 2 * radius;
    let radiansLeft = end - start;
    let pillarHeightPrevious = -1;

    for (let radians = start + Math.PI * 2 * this.PILLAR_RADIUS_MIN / circumference; radiansLeft > 0;) {
        const shift = (random.getFloat() * 2 - 1) * this.PILLAR_SHIFT_AMPLITUDE;
        const rockX = x + Math.cos(radians) * (radius + shift);
        const rockY = y + Math.sin(radians) * (radius + shift);
        let intensity;

        if (rockX < xMin ||
            rockX > xMax ||
            rockY < yMin ||
            rockY > yMax ||
            (intensity = sampler(rockX, rockY)) <= 0) {
            radians += this.PILLAR_RADIUS_MIN;
            radiansLeft -= this.PILLAR_RADIUS_MIN;

            continue;
        }

        const pillarRadius = this.PILLAR_RADIUS_MIN +
            (this.PILLAR_RADIUS_MAX - this.PILLAR_RADIUS_MIN) *
            Math.pow(random.getFloat(), this.PILLAR_RADIUS_POWER) * intensity;
        let pillarHeight = pillarRadius *
            (this.PILLAR_HEIGHT_MIN + (this.PILLAR_HEIGHT_MAX - this.PILLAR_HEIGHT_MIN) * random.getFloat());

        if (Math.abs(pillarHeight - pillarHeightPrevious) < this.PILLAR_HEIGHT_DELTA)
            pillarHeight = pillarHeightPrevious + Math.sign(pillarHeight - pillarHeightPrevious) * this.PILLAR_HEIGHT_DELTA;

        const radiansStep = Math.PI * 2 * pillarRadius / circumference *
            (this.PILLAR_SPACING_MIN + (this.PILLAR_SPACING_MAX - this.PILLAR_SPACING_MIN) * random.getFloat());

        plans.push(new Rocks.Plan(rockX, rockY, pillarRadius, pillarHeight));

        radians += radiansStep;
        radiansLeft -= radiansStep;
        pillarHeightPrevious = pillarHeight;
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
 * @param {Number} yScale The Y projection scale in the range [0, 1]
 * @param {Random} random A randomizer
 */
Rocks.prototype.createPillar = function(
    vertices,
    indices,
    x,
    y,
    radius,
    height,
    yScale,
    random) {
    const firstIndex = this.getFirstIndex(vertices);
    const precision = Math.ceil(2 * Math.PI * radius / this.PILLAR_RESOLUTION);
    const offset = random.getFloat() * Math.PI / precision;
    const zShift = (-.5 + random.getFloat()) * .5;
    const lightTop = .8 - zShift * .4;
    let lastStep = precision - 1;

    for (let step = 0; step < precision; ++step) {
        const radians = Math.PI * 2 * step / precision + offset;
        const dx = Math.cos(radians) * radius;
        const dy = Math.sin(radians) * radius * yScale;
        const l = Math.sqrt(dx * dx + dy * dy);
        const lx = 1 / Math.sqrt(2);
        const ly = 1 / Math.sqrt(2);
        const nx = dx / l;
        const ny = dy / l;
        const light = this.PILLAR_LIGHT_AMBIENT + (1 - this.PILLAR_LIGHT_AMBIENT) * Math.max(0, nx * lx + ny * ly);

        vertices.push(
            this.COLOR_SIDE.r * light * this.PILLAR_LIGHT_BASE,
            this.COLOR_SIDE.g * light * this.PILLAR_LIGHT_BASE,
            this.COLOR_SIDE.b * light * this.PILLAR_LIGHT_BASE,
            x + dx,
            y + dy,
            0,
            this.COLOR_SIDE.r * light,
            this.COLOR_SIDE.g * light,
            this.COLOR_SIDE.b * light,
            x + dx * this.PILLAR_SKEW,
            y + dy * this.PILLAR_SKEW,
            height + dx * zShift * this.PILLAR_SKEW,
            this.COLOR_TOP.r * lightTop,
            this.COLOR_TOP.g * lightTop,
            this.COLOR_TOP.b * lightTop,
            x + dx * this.PILLAR_SKEW,
            y + dy * this.PILLAR_SKEW,
            height + dx * zShift * this.PILLAR_SKEW);

        if (step !== 0 && step <= precision >> 1)
            indices.push(
                firstIndex + lastStep * 3,
                firstIndex + lastStep * 3 + 1,
                firstIndex + step * 3 + 1,
                firstIndex + step * 3 + 1,
                firstIndex + step * 3,
                firstIndex + lastStep * 3);

        indices.push(
            firstIndex + precision * 3,
            firstIndex + step * 3 + 2,
            firstIndex + lastStep * 3 + 2);

        lastStep = step;
    }

    vertices.push(
        this.COLOR_TOP.r * lightTop,
        this.COLOR_TOP.g * lightTop,
        this.COLOR_TOP.b * lightTop,
        x,
        y,
        height);
};

/**
 * Free all resources maintained by this object
 */
Rocks.prototype.free = function() {
    this.mesh.free();
};