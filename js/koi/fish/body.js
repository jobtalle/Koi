/**
 * A fish body
 * @param {Pattern} pattern A body pattern
 * @param {Vector2} atlasPixel The pixel size on the atlas in UV coordinates
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @constructor
 */
const Body = function(pattern, atlasPixel, length, thickness) {
    this.pattern = pattern;
    this.atlasPixel = atlasPixel;
    this.radius = thickness * .5;
    this.spine = new Array(this.RESOLUTION);
    this.spinePrevious = new Array(this.spine.length);
    this.spacing = length / (this.spine.length - 1);
    this.inverseSpacing = 1 / this.spacing;
    this.springs = this.makeSprings(this.SPRING_START, this.SPRING_END, this.SPRING_POWER);
    this.u = this.makeU(atlasPixel);
    this.phase = 0;
};

Body.prototype.RESOLUTION = 10;
Body.prototype.SPRING_START = .9;
Body.prototype.SPRING_END = .3;
Body.prototype.SPRING_POWER = 1.7;
Body.prototype.SWIM_AMPLITUDE = 8.5;
Body.prototype.SWIM_SPEED = 6.5;
Body.prototype.SPEED_THRESHOLD = .02;

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
 * Make an array of texture U coordinates per segment
 * @param {Vector2} atlasPixel The pixel size on the atlas in UV coordinates
 * @returns {Number[]} The U array
 */
Body.prototype.makeU = function(atlasPixel) {
    const uStart = this.pattern.slot.x + atlasPixel.x;
    const uEnd = this.pattern.slot.x + this.pattern.size.x - atlasPixel.y;
    const u = new Array(this.spine.length);

    for (let segment = 0; segment < this.spine.length; ++segment)
        u[segment] = uStart + (uEnd - uStart) * segment / (this.spine.length - 1);

    return u;
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
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Body.prototype.render = function(renderer, time) {
    let xp, x = this.spinePrevious[0].x + (this.spine[0].x - this.spinePrevious[0].x) * time;
    let yp, y = this.spinePrevious[0].y + (this.spine[0].y - this.spinePrevious[0].y) * time;
    let dxp, dx;
    let dyp, dy;

    renderer.cutStrip(x, y, 0, 0);

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

        renderer.drawStrip(
            xp - this.radius * dyAveraged * this.inverseSpacing,
            yp + this.radius * dxAveraged * this.inverseSpacing,
            this.u[segment - 1],
            this.pattern.slot.y + this.atlasPixel.y);
        renderer.drawStrip(
            xp + this.radius * dyAveraged * this.inverseSpacing,
            yp - this.radius * dxAveraged * this.inverseSpacing,
            this.u[segment - 1],
            this.pattern.slot.y + this.pattern.size.y - this.atlasPixel.y);
    }

    renderer.cutStrip(
        this.spinePrevious[this.spine.length - 1].x +
            (this.spine[this.spine.length - 1].x - this.spinePrevious[this.spine.length - 1].x) * time,
        this.spinePrevious[this.spine.length - 1].y +
            (this.spine[this.spine.length - 1].y - this.spinePrevious[this.spine.length - 1].y) * time,
        this.u[this.spine.length - 1],
        this.pattern.slot.y + this.pattern.size.y * .5);
};

/**
 * Free all resources maintained by this body
 * @param {Atlas} atlas The texture atlas
 */
Body.prototype.free = function(atlas) {
    this.pattern.free(atlas);
};