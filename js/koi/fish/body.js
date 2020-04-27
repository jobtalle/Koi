/**
 * A fish body
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @param {Vector} head The head position
 * @param {Vector} direction The body direction
 * @constructor
 */
const Body = function(length, thickness, head, direction) {
    this.spine = new Array(Math.ceil(length / this.RESOLUTION) + 1);
    this.spinePrevious = new Array(this.spine.length);
    this.spacing = length / (this.spine.length - 1);
    this.inverseSpacing = 1 / this.spacing;
    this.radii = this.makeRadii(thickness, .6);
    this.springs = this.makeSprings(this.SPRING_START, this.SPRING_END, this.SPRING_POWER);
    this.phase = 0;

    this.initializeSpine(head, direction);
};

Body.prototype.RESOLUTION = .14;
Body.prototype.SPRING_START = .9;
Body.prototype.SPRING_END = .3;
Body.prototype.SPRING_POWER = 1.7;
Body.prototype.SWIM_AMPLITUDE = 8.5;
Body.prototype.SWIM_SPEED = 6.5;
Body.prototype.SPEED_THRESHOLD = .02;

/**
 * Initialize the spine
 * @param {Vector} head The head position
 * @param {Vector} direction The initial body direction
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
 * Calculate body segment radii
 * @param {Number} thickness The body thickness at its thickest point
 * @param {Number} power A power to apply to the position of the widest point of the body
 * @returns {Number[]} An array of radii
 */
Body.prototype.makeRadii = function(thickness, power) {
    const radii = new Array(this.spine.length);

    for (let segment = 0; segment < this.spine.length; ++segment)
        radii[segment] = Math.cos(Math.PI * ((segment / (this.spine.length - 1)) ** power + .5)) * thickness * .5;

    return radii;
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
        springs[spring ] = start + (end - start) * ((spring / (this.spine.length - 2)) ** power);

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
 * @param {Vector} head The new head position
 * @param {Vector} direction The normalized head direction
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
    let xStart, xEnd = this.spinePrevious[0].x + (this.spine[0].x - this.spinePrevious[0].x) * time;
    let yStart, yEnd = this.spinePrevious[0].y + (this.spine[0].y - this.spinePrevious[0].y) * time;
    let dxStart, dxEnd = 0;
    let dyStart, dyEnd = 0;

    renderer.cutStrip(xEnd, yEnd);

    for (let segment = 1; segment < this.spine.length - 1; ++segment) {
        xStart = xEnd;
        yStart = yEnd;
        dxStart = dxEnd;
        dyStart = dyEnd;
        xEnd = this.spinePrevious[segment].x + (this.spine[segment].x - this.spinePrevious[segment].x) * time;
        yEnd = this.spinePrevious[segment].y + (this.spine[segment].y - this.spinePrevious[segment].y) * time;
        dxEnd = xEnd - xStart;
        dyEnd = yEnd - yStart;

        renderer.drawStrip(
            xEnd - this.radii[segment] * dyEnd * this.inverseSpacing,
            yEnd + this.radii[segment] * dxEnd * this.inverseSpacing);
        renderer.drawStrip(
            xEnd + this.radii[segment] * dyEnd * this.inverseSpacing,
            yEnd - this.radii[segment] * dxEnd * this.inverseSpacing);
    }

    renderer.cutStrip(
        this.spinePrevious[this.spine.length - 1].x +
            (this.spine[this.spine.length - 1].x - this.spinePrevious[this.spine.length - 1].x) * time,
        this.spinePrevious[this.spine.length - 1].y +
            (this.spine[this.spine.length - 1].y - this.spinePrevious[this.spine.length - 1].y) * time);
};