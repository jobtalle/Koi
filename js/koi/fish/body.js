/**
 * A fish body
 * @param {Pattern} pattern A body pattern=
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @constructor
 */
const Body = function(pattern, length, thickness) {
    this.pattern = pattern;
    this.radius = thickness * .5;
    this.spine = new Array(this.RESOLUTION);
    this.spinePrevious = new Array(this.spine.length);
    this.spacing = length / (this.spine.length - 1);
    this.inverseSpacing = 1 / this.spacing;
    this.springs = this.makeSprings(this.SPRING_START, this.SPRING_END, this.SPRING_POWER);
    this.phase = 0;
};

Body.prototype.RESOLUTION = 10;
Body.prototype.SPRING_START = .9;
Body.prototype.SPRING_END = .3;
Body.prototype.SPRING_POWER = 1.7;
Body.prototype.SWIM_AMPLITUDE = 8.5;
Body.prototype.SWIM_SPEED = 6.5;
Body.prototype.SPEED_THRESHOLD = .02;
Body.prototype.OVERLAP_PADDING = 1.8;

/**
 * Instantly move the body to the given position
 * @param {Vector2} position The position to move the spine head to
 */
Body.prototype.moveTo = function(position) {
    const dx = position.x - this.spine[0].x;
    const dy = position.y - this.spine[0].y;

    for (const point of this.spine) {
        point.x += dx;
        point.y += dy;
    }
};

/**
 * Check if this fish overlaps the given position
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Boolean} A boolean indicating whether this body has been hit
 */
Body.prototype.atPosition = function(x, y) {
    let dx = x - this.spine[0].x;
    let dy = y - this.spine[0].y;
    let radius = this.spacing * (this.spine.length - 1);

    if (dx * dx + dy * dy > radius * radius)
        return false;

    for (let segment = 1; segment < this.spine.length - 1; ++segment) {
        dx = x - this.spine[segment].x;
        dy = y - this.spine[segment].y;
        radius = this.pattern.shape.sample(segment / (this.spine.length - 1)) * this.radius * this.OVERLAP_PADDING;

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
Body.prototype.initializeSpine = function(head, direction) {
    this.spine[0] = head.copy();
    this.spinePrevious[0] = head.copy();

    for (let segment = 1; segment < this.spine.length; ++segment) {
        this.spine[segment] = this.spine[segment - 1].copy().subtract(direction.copy().multiply(this.spacing));
        this.spinePrevious[segment] = this.spine[segment].copy();
    }
};

/**
 * Make spring strengths
 * @param {Number} start The spring strength at the head
 * @param {Number} end The spring strength at the tail
 * @param {Number} power A power to apply to the spring strength attenuation
 * @returns {Number[]} An array of strings
 */
Body.prototype.makeSprings = function(start, end, power) {
    const springs = new Array(this.spine.length - 1);

    for (let spring = 0; spring < this.spine.length - 1; ++spring)
        springs[spring] = start + (end - start) * ((spring / (this.spine.length - 2)) ** power);

    return springs;
};

/**
 * Store the current state into the previous state
 */
Body.prototype.storePreviousState = function() {
    for (let segment = 0; segment < this.spine.length; ++segment)
        this.spinePrevious[segment].set(this.spine[segment]);
};

/**
 * Update the body state
 * @param {Vector2} head The new head position
 * @param {Vector2} direction The normalized head direction
 * @param {Number} speed The fish speed
 */
Body.prototype.update = function(head, direction, speed) {
    this.storePreviousState();
    this.spine[0].set(head);

    const speedFactor = speed - this.SPEED_THRESHOLD;
    const angle = direction.angle() + Math.PI + Math.cos(this.phase) * speedFactor * this.SWIM_AMPLITUDE;

    let xDir = Math.cos(angle);
    let yDir = Math.sin(angle);

    for (let segment = 1; segment < this.spine.length; ++segment) {
        let dx = this.spine[segment].x - this.spine[segment - 1].x;
        let dy = this.spine[segment].y - this.spine[segment - 1].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        const dxc = this.spine[segment - 1].x + xDir * this.spacing - this.spine[segment].x;
        const dyc = this.spine[segment - 1].y + yDir * this.spacing - this.spine[segment].y;

        xDir = dx / distance;
        yDir = dy / distance;

        dx += dxc * this.springs[segment - 1];
        dy += dyc * this.springs[segment - 1];

        distance = Math.sqrt(dx * dx + dy * dy);

        this.spine[segment].set(this.spine[segment - 1]);
        this.spine[segment].x += this.spacing * dx / distance;
        this.spine[segment].y += this.spacing * dy / distance;
    }

    if ((this.phase += this.SWIM_SPEED * speed) > Math.PI * 2)
        this.phase -= Math.PI * 2;
};

/**
 * Render the body
 * @param {Primitives} primitives The primitives renderer
 * @param {Number} time The interpolation factor
 */
Body.prototype.render = function(primitives, time) {
    const uStart = this.pattern.slot.x + this.pattern.pixelSize.x;
    const uLength = this.pattern.slot.x + this.pattern.size.x - this.pattern.pixelSize.x - uStart;

    let xp, x = this.spinePrevious[0].x + (this.spine[0].x - this.spinePrevious[0].x) * time;
    let yp, y = this.spinePrevious[0].y + (this.spine[0].y - this.spinePrevious[0].y) * time;
    let dxp, dx;
    let dyp, dy;

    primitives.cutStrip(x, y, 0, 0);

    for (let segment = 1; segment < this.spine.length; ++segment) {
        xp = x;
        yp = y;

        x = this.spinePrevious[segment].x + (this.spine[segment].x - this.spinePrevious[segment].x) * time;
        y = this.spinePrevious[segment].y + (this.spine[segment].y - this.spinePrevious[segment].y) * time;

        if (segment === 1) {
            dx = x - xp;
            dy = y - yp;
        }

        dxp = dx;
        dyp = dy;
        dx = x - xp;
        dy = y - yp;

        const dxAveraged = (dx + dxp) * .5;
        const dyAveraged = (dy + dyp) * .5;
        const u = uStart + uLength * (segment - 1) / (this.spine.length - 1);

        primitives.drawStrip(
            xp - this.radius * dyAveraged * this.inverseSpacing,
            yp + this.radius * dxAveraged * this.inverseSpacing,
            u,
            this.pattern.slot.y + this.pattern.pixelSize.y);
        primitives.drawStrip(
            xp + this.radius * dyAveraged * this.inverseSpacing,
            yp - this.radius * dxAveraged * this.inverseSpacing,
            u,
            this.pattern.slot.y + this.pattern.size.y - this.pattern.pixelSize.y);
    }

    primitives.cutStrip(
        this.spinePrevious[this.spine.length - 1].x +
            (this.spine[this.spine.length - 1].x - this.spinePrevious[this.spine.length - 1].x) * time,
        this.spinePrevious[this.spine.length - 1].y +
            (this.spine[this.spine.length - 1].y - this.spinePrevious[this.spine.length - 1].y) * time,
        uStart + uLength,
        this.pattern.slot.y + this.pattern.size.y * .5);
};

/**
 * Free all resources maintained by this body
 * @param {Atlas} atlas The texture atlas
 */
Body.prototype.free = function(atlas) {
    this.pattern.free(atlas);
};