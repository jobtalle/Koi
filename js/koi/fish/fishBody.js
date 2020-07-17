/**
 * A fish body
 * @param {Pattern} pattern A body pattern
 * @param {Fin[]} fins The fins
 * @param {Tail} tail The tail
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @constructor
 */
const FishBody = function(pattern, fins, tail, length, thickness) {
    this.pattern = pattern;
    this.fins = fins;
    this.tail = tail;
    this.length = length;
    this.radius = thickness * .5;
    this.spine = new Array(Math.ceil(length / this.RESOLUTION));
    this.tailOffset = this.spine.length - 1;
    this.finGroups = this.assignFins(fins, this.spine.length);
    this.spinePrevious = new Array(this.spine.length);
    this.springs = this.makeSprings(this.SPRING_START, this.SPRING_END, this.SPRING_POWER);
    this.phase = 0;
    this.finPhase = 0;
    this.spacing = .1;
    this.inverseSpacing = 1 / this.spacing;
};

FishBody.prototype.RESOLUTION = .1;
FishBody.prototype.SPRING_START = .9;
FishBody.prototype.SPRING_END = .65;
FishBody.prototype.SPRING_POWER = 1.7;
FishBody.prototype.SWIM_AMPLITUDE = 11;
FishBody.prototype.SWIM_SPEED = 6.5;
FishBody.prototype.SPEED_SWING_THRESHOLD = .01;
FishBody.prototype.SPEED_WAVE_THRESHOLD = .055;
FishBody.prototype.OVERLAP_PADDING = 1.8;
FishBody.prototype.WAVE_RADIUS = .15;
FishBody.prototype.WAVE_INTENSITY_MIN = .05;
FishBody.prototype.WAVE_INTENSITY_MULTIPLIER = 2;
FishBody.prototype.WAVE_TURBULENCE = .4;
FishBody.prototype.FIN_PHASE_SPEED = .4;

/**
 * Deserialize a fish body
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @param {Atlas} atlas The atlas
 */
FishBody.deserialize = function(buffer, atlas) {
    const random = new Random(); // TODO: Debug only
    const pattern = new Pattern(
        new PatternBase(Color.fromCSS("fish-base")),
        [
            new PatternSpots(
                1.5,
                Color.fromCSS("fish-spots-orange"),
                new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()
            )
        ],
        new PatternShapeBody(0.6, 0.7),
        new PatternShapeFin());

    atlas.write(pattern);

    return new FishBody(
        pattern,
        [
            new Fin(.2, 1.4, 1), new Fin(.2, 1.4, -1),
            new Fin(.5, .8, 1), new Fin(.5, .8, -1)
        ],
        new Tail(.3),
        1.2,
        .3);
};

/**
 * Serialize this fish body
 * @param {BinBuffer} buffer A buffer to serialize to
 */
FishBody.prototype.serialize = function(buffer) {
    //
};

/**
 * Assign fins to an array matching the vertebrae
 * @param {Fin[]} fins All fins
 * @param {Number} spineLength The length of the spine
 * @returns {Fin[][]} An array containing an array of fins per vertebrae
 */
FishBody.prototype.assignFins = function(fins, spineLength) {
    const spineFins = new Array(spineLength).fill(null);

    for (const fin of fins) {
        const index = fin.getVertebraIndex(spineLength);

        if (!spineFins[index])
            spineFins[index] = [];

        spineFins[index].push(fin);

        fin.connect(this.pattern, this.pattern.shapeBody.sample(index / (spineLength - 1)) * this.radius);
    }

    return spineFins;
};

/**
 * Disturb water while swimming
 * @param {Water} water A water plane to disturb
 * @param {Random} random A randomizer
 */
FishBody.prototype.disturbWater = function(water, random) {
    const tailIndex = this.spine.length - 2;
    const dx = this.spine[tailIndex].x - this.spinePrevious[tailIndex].x;
    const dy = this.spine[tailIndex].y - this.spinePrevious[tailIndex].y;
    const tailSpeedSquared = dx * dx + dy * dy;

    if (tailSpeedSquared > this.SPEED_WAVE_THRESHOLD * this.SPEED_WAVE_THRESHOLD) {
        const tailSpeed = Math.sqrt(tailSpeedSquared);
        const intensity = this.WAVE_INTENSITY_MIN + (tailSpeed - this.SPEED_WAVE_THRESHOLD) *
            this.WAVE_INTENSITY_MULTIPLIER;

        water.addFlare(
            this.spine[tailIndex].x,
            this.spine[tailIndex].y,
            this.WAVE_RADIUS,
            intensity * (random.getFloat() * this.WAVE_TURBULENCE + (1 - this.WAVE_TURBULENCE)));
    }
};

/**
 * Instantly move the body to the given position
 * @param {Vector2} position The position to move the spine head to
 */
FishBody.prototype.moveTo = function(position) {
    const dx = position.x - this.spine[0].x;
    const dy = position.y - this.spine[0].y;

    for (const vertebra of this.spine) {
        vertebra.x += dx;
        vertebra.y += dy;
    }

    for (const fin of this.fins)
        fin.shift(dx, dy);

    this.tail.shift(dx, dy);
};

/**
 * Check if this fish overlaps the given position
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Boolean} A boolean indicating whether this body has been hit
 */
FishBody.prototype.atPosition = function(x, y) {
    // TODO: Use a better method which allows padding
    // TODO: Also check fins
    let dx = x - this.spine[0].x;
    let dy = y - this.spine[0].y;
    let radius = this.spacing * (this.spine.length - 1);

    if (dx * dx + dy * dy > radius * radius)
        return false;

    for (let segment = 1; segment < this.spine.length - 1; ++segment) {
        dx = x - this.spine[segment].x;
        dy = y - this.spine[segment].y;
        radius = this.pattern.shapeBody.sample(segment / (this.spine.length - 1)) * this.radius * this.OVERLAP_PADDING;

        if (dx * dx + dy * dy < radius * radius)
            return true;
    }

    return false;
};

/**
 * Initialize the spine
 * @param {Vector2} head The head position
 * @param {Vector2} direction The initial body direction
 */
FishBody.prototype.initializeSpine = function(head, direction) {
    this.spine[0] = head.copy();
    this.spinePrevious[0] = head.copy();

    for (let vertebra = 1; vertebra < this.spine.length; ++vertebra) {
        this.spine[vertebra] = this.spine[vertebra - 1].copy().subtract(direction.copy().multiply(this.spacing));
        this.spinePrevious[vertebra] = this.spine[vertebra].copy();

        if (this.finGroups[vertebra]) for (const fin of this.finGroups[vertebra])
            fin.initializePosition(this.spine[vertebra]);
    }

    this.tailOffset = this.tail.connect(this.spine);
};

/**
 * Make spring strengths
 * @param {Number} start The spring strength at the head
 * @param {Number} end The spring strength at the tail
 * @param {Number} power A power to apply to the spring strength attenuation
 * @returns {Number[]} An array of strings
 */
FishBody.prototype.makeSprings = function(start, end, power) {
    const springs = new Array(this.spine.length - 1);

    for (let spring = 0; spring < this.spine.length - 1; ++spring)
        springs[spring] = start + (end - start) * ((spring / (this.spine.length - 2)) ** power);

    return springs;
};

/**
 * Store the current state into the previous state
 */
FishBody.prototype.storePreviousState = function() {
    for (let segment = 0; segment < this.spine.length; ++segment)
        this.spinePrevious[segment].set(this.spine[segment]);
};

/**
 * Calculate the spacing of this body
 * @param {Number} size The fish size in the range [0, 1]
 */
FishBody.prototype.calculateSpacing = function(size) {
    this.spacing = size * this.length / (this.spine.length - 1);
    this.inverseSpacing = 1 / this.spacing;
};

/**
 * Update the body state
 * @param {Vector2} head The new head position
 * @param {Vector2} direction The normalized head direction
 * @param {Number} speed The fish speed
 * @param {Number} size The fish size in the range [0, 1]
 * @param {Water} [water] A water plane to disturb
 * @param {Random} [random] A randomizer, required when water is supplied
 */
FishBody.prototype.update = function(
    head,
    direction,
    speed,
    size,
    water = null,
    random = null) {
    this.storePreviousState();
    this.spine[0].set(head);
    this.calculateSpacing(size);

    const speedFactor = speed - this.SPEED_SWING_THRESHOLD;
    const angle = direction.angle() + Math.PI + Math.cos(this.phase) * speedFactor * this.SWIM_AMPLITUDE;

    let xDir = Math.cos(angle);
    let yDir = Math.sin(angle);

    for (let vertebra = 1, vertebrae = this.spine.length; vertebra < vertebrae; ++vertebra) {
        let dx = this.spine[vertebra].x - this.spine[vertebra - 1].x;
        let dy = this.spine[vertebra].y - this.spine[vertebra - 1].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        const spring = this.springs[vertebra - 1] + (1 - this.springs[vertebra - 1]) * (1 - size);
        const dxc = this.spine[vertebra - 1].x + xDir * this.spacing - this.spine[vertebra].x;
        const dyc = this.spine[vertebra - 1].y + yDir * this.spacing - this.spine[vertebra].y;
        const xDirPrevious = xDir;
        const yDirPrevious = yDir;

        xDir = dx / distance;
        yDir = dy / distance;

        dx += dxc * spring;
        dy += dyc * spring;

        distance = Math.sqrt(dx * dx + dy * dy);

        this.spine[vertebra].set(this.spine[vertebra - 1]);
        this.spine[vertebra].x += this.spacing * dx / distance;
        this.spine[vertebra].y += this.spacing * dy / distance;

        if (this.finGroups[vertebra]) for (const fin of this.finGroups[vertebra])
            fin.update(
                this.spine[vertebra],
                xDirPrevious,
                yDirPrevious,
                this.finPhase,
                size);
    }

    this.tail.update(this.spine);

    if ((this.phase += this.SWIM_SPEED * speed / size) > Math.PI + Math.PI)
        this.phase -= Math.PI + Math.PI;

    if ((this.finPhase -= this.FIN_PHASE_SPEED) < 0)
        this.finPhase += Math.PI + Math.PI;

    if (water)
        this.disturbWater(water, random);
};

/**
 * Render the body
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} size The fish size in the range [0, 1]
 * @param {Number} time The interpolation factor
 */
FishBody.prototype.render = function(bodies, size, time) {
    for (const fin of this.fins)
        fin.render(bodies, time);

    const indexOffsetFin = bodies.buffer.getVertexCount();
    const indexOffset = indexOffsetFin + this.tail.getVertexCount();
    const indexOffsetBack = indexOffset + ((this.tailOffset + 1) << 1);

    this.tail.renderBottom(bodies, indexOffsetFin, indexOffsetBack, size, this.pattern, time);

    let xp, x = this.spinePrevious[0].x + (this.spine[0].x - this.spinePrevious[0].x) * time;
    let yp, y = this.spinePrevious[0].y + (this.spine[0].y - this.spinePrevious[0].y) * time;
    let dxp, dx;
    let dyp, dy;
    let startIndex = indexOffset;

    for (let vertebra = 1, vertebrae = this.spine.length; vertebra < vertebrae; ++vertebra) {
        xp = x;
        yp = y;

        x = this.spinePrevious[vertebra].x + (this.spine[vertebra].x - this.spinePrevious[vertebra].x) * time;
        y = this.spinePrevious[vertebra].y + (this.spine[vertebra].y - this.spinePrevious[vertebra].y) * time;

        if (vertebra === 1) {
            dx = x - xp;
            dy = y - yp;
        }

        dxp = dx;
        dyp = dy;
        dx = x - xp;
        dy = y - yp;

        const radius = this.radius * size;
        const dxAveraged = (dx + dxp) * .5;
        const dyAveraged = (dy + dyp) * .5;
        const u = this.pattern.region.uBodyStart + (this.pattern.region.uBodyEnd - this.pattern.region.uBodyStart) *
            (vertebra - 1) / (vertebrae - 1);

        bodies.buffer.addVertices(
            xp - radius * dyAveraged * this.inverseSpacing,
            yp + radius * dxAveraged * this.inverseSpacing,
            u,
            this.pattern.region.vStart,
            xp + radius * dyAveraged * this.inverseSpacing,
            yp - radius * dxAveraged * this.inverseSpacing,
            u,
            this.pattern.region.vEnd);

        if (vertebra > this.tailOffset) {
            bodies.buffer.addVertices(
                xp,
                yp,
                this.pattern.region.uFinStart + (this.pattern.region.uFinEnd - this.pattern.region.uFinStart) * .5,
                this.pattern.region.vStart + (this.pattern.region.vEnd - this.pattern.region.vStart) * .5);

            if (vertebra === vertebrae - 1)
                bodies.buffer.addIndices(
                    startIndex,
                    startIndex + 1,
                    startIndex + 3);
            else
                bodies.buffer.addIndices(
                    startIndex,
                    startIndex + 1,
                    startIndex + 4,
                    startIndex + 4,
                    startIndex + 3,
                    startIndex);

            startIndex += 3;
        }
        else {
            bodies.buffer.addIndices(
                startIndex,
                startIndex + 1,
                startIndex + 3,
                startIndex + 3,
                startIndex + 2,
                startIndex);

            startIndex += 2;
        }
    }

    bodies.buffer.addVertices(
        this.spinePrevious[this.spine.length - 1].x +
            (this.spine[this.spine.length - 1].x - this.spinePrevious[this.spine.length - 1].x) * time,
        this.spinePrevious[this.spine.length - 1].y +
            (this.spine[this.spine.length - 1].y - this.spinePrevious[this.spine.length - 1].y) * time,
        this.pattern.region.uBodyEnd,
        (this.pattern.region.vStart + this.pattern.region.vEnd) * .5);
    bodies.buffer.addVertices(
        this.spinePrevious[this.spine.length - 1].x +
        (this.spine[this.spine.length - 1].x - this.spinePrevious[this.spine.length - 1].x) * time,
        this.spinePrevious[this.spine.length - 1].y +
        (this.spine[this.spine.length - 1].y - this.spinePrevious[this.spine.length - 1].y) * time,
        this.pattern.region.uFinStart + (this.pattern.region.uFinEnd - this.pattern.region.uFinStart) * .5,
        (this.pattern.region.vStart + this.pattern.region.vEnd) * .5);

    this.tail.renderTop(bodies, indexOffsetFin, indexOffsetBack);
};

/**
 * Free all resources maintained by this body
 * @param {Atlas} atlas The texture atlas
 */
FishBody.prototype.free = function(atlas) {
    this.pattern.free(atlas);
};