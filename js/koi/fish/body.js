/**
 * A fish body
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @param {Vector} head The head position
 * @param {Vector} direction The body direction
 * @constructor
 */
const Body = function(length, thickness, head, direction) {
    this.segments = new Array(Math.ceil(length / this.RESOLUTION) + 1);
    this.segmentsPrevious = new Array(this.segments.length);
    this.spacing = length / (this.segments.length - 1);
    this.inverseSpacing = 1 / this.spacing;
    this.radii = this.makeRadii(thickness, .6);
    this.phase = 0;

    this.segments[0] = head.copy();

    for (let segment = 1; segment < this.segments.length; ++segment)
        this.segments[segment] = this.segments[segment - 1].copy().subtract(direction.copy().multiply(this.spacing));

    for (let segment = 0; segment < this.segments.length; ++segment)
        this.segmentsPrevious[segment] = this.segments[segment].copy();
};

Body.prototype.RESOLUTION = .15;
Body.prototype.SPRING = .6;
Body.prototype.SWIM_AMPLITUDE = 10;
Body.prototype.SWIM_SPEED = 8;

/**
 * Calculate body segment radii
 * @param {Number} thickness The body thickness at its thickest point
 * @param {Number} power A power to apply to the position of the widest point of the body
 */
Body.prototype.makeRadii = function(thickness, power) {
    const radii = new Array(this.segments.length);

    for (let segment = 0; segment < this.segments.length; ++segment)
        radii[segment] = Math.cos(Math.PI * ((segment / (this.segments.length - 1)) ** power + .5)) * thickness * .5;

    return radii;
};

/**
 * Store the current state into the previous state
 */
Body.prototype.storePreviousState = function() {
    for (let segment = 0; segment < this.segments.length; ++segment)
        this.segmentsPrevious[segment].set(this.segments[segment]);
};

/**
 * Update the body state
 * @param {Vector} head The new head position
 * @param {Vector} direction The normalized head direction
 * @param {Number} speed The fish speed
 */
Body.prototype.update = function(head, direction, speed) {
    this.storePreviousState();
    this.segments[0].set(head);

    const speedFactor = speed - Fish.prototype.SPEED_MIN;
    const angle = direction.angle() + Math.PI + Math.cos(this.phase) * speedFactor * this.SWIM_AMPLITUDE;

    let xDir = Math.cos(angle);
    let yDir = Math.sin(angle);

    for (let segment = 1; segment < this.segments.length; ++segment) {
        let dx = this.segments[segment].x - this.segments[segment - 1].x;
        let dy = this.segments[segment].y - this.segments[segment - 1].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        const dxc = this.segments[segment - 1].x + xDir * this.spacing - this.segments[segment].x;
        const dyc = this.segments[segment - 1].y + yDir * this.spacing - this.segments[segment].y;

        xDir = dx / distance;
        yDir = dy / distance;

        dx += dxc * this.SPRING;
        dy += dyc * this.SPRING;

        distance = Math.sqrt(dx * dx + dy * dy);

        this.segments[segment].set(this.segments[segment - 1]);
        this.segments[segment].x += this.spacing * dx / distance;
        this.segments[segment].y += this.spacing * dy / distance;
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
    let xStart, xEnd = this.segmentsPrevious[0].x + (this.segments[0].x - this.segmentsPrevious[0].x) * time;
    let yStart, yEnd = this.segmentsPrevious[0].y + (this.segments[0].y - this.segmentsPrevious[0].y) * time;
    let dxStart, dxEnd = 0;
    let dyStart, dyEnd = 0;

    for (let segment = 1; segment < this.segments.length; ++segment) {
        xStart = xEnd;
        yStart = yEnd;
        dxStart = dxEnd;
        dyStart = dyEnd;
        xEnd = this.segmentsPrevious[segment].x + (this.segments[segment].x - this.segmentsPrevious[segment].x) * time;
        yEnd = this.segmentsPrevious[segment].y + (this.segments[segment].y - this.segmentsPrevious[segment].y) * time;
        dxEnd = xEnd - xStart;
        dyEnd = yEnd - yStart;

        renderer.drawLine(
            xStart + this.radii[segment - 1] * dyStart * this.inverseSpacing,
            yStart - this.radii[segment - 1] * dxStart * this.inverseSpacing,
            Color.WHITE,
            xEnd + this.radii[segment] * dyEnd * this.inverseSpacing,
            yEnd - this.radii[segment] * dxEnd * this.inverseSpacing,
            Color.WHITE);
        renderer.drawLine(
            xStart - this.radii[segment - 1] * dyStart * this.inverseSpacing,
            yStart + this.radii[segment - 1] * dxStart * this.inverseSpacing,
            Color.WHITE,
            xEnd - this.radii[segment] * dyEnd * this.inverseSpacing,
            yEnd + this.radii[segment] * dxEnd * this.inverseSpacing,
            Color.WHITE);
    }
};