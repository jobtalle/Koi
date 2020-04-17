/**
 * A fish body
 * @param {Number} length The body length
 * @param {Number} thickness The body thickness
 * @param {Vector} head The head position
 * @param {Vector} direction The body direction
 * @constructor
 */
const Body = function(length, thickness, head, direction) {
    this.thickness = thickness;
    this.segments = new Array(Math.ceil(length / this.RESOLUTION) + 1);
    this.segmentsPrevious = new Array(this.segments.length);
    this.spacing = length / (this.segments.length - 1);

    this.segments[0] = head.copy();

    for (let segment = 1; segment < this.segments.length; ++segment)
        this.segments[segment] = this.segments[segment - 1].copy().subtract(direction.copy().multiply(this.spacing));

    for (let segment = 0; segment < this.segments.length; ++segment)
        this.segmentsPrevious[segment] = this.segments[segment].copy();
};

Body.prototype.RESOLUTION = .15;

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
 */
Body.prototype.update = function(head) {
    this.storePreviousState();

    this.segments[0].set(head);

    for (let segment = 1; segment < this.segments.length; ++segment) {
        const dx = this.segments[segment].x - this.segments[segment - 1].x;
        const dy = this.segments[segment].y - this.segments[segment - 1].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.segments[segment].set(this.segments[segment - 1]);
        this.segments[segment].x += this.spacing * dx / distance;
        this.segments[segment].y += this.spacing * dy / distance;
    }
};

/**
 * Render the body
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Body.prototype.render = function(renderer, time) {
    let xStart, xEnd = this.segmentsPrevious[0].x + (this.segments[0].x - this.segmentsPrevious[0].x) * time;
    let yStart, yEnd = this.segmentsPrevious[0].y + (this.segments[0].y - this.segmentsPrevious[0].y) * time;
    let wStart, wEnd = 0;
    let dxStart, dxEnd = 0;
    let dyStart, dyEnd = 0;

    for (let segment = 1; segment < this.segments.length; ++segment) {
        xStart = xEnd;
        yStart = yEnd;
        wStart = wEnd;
        dxStart = dxEnd;
        dyStart = dyEnd;
        xEnd = this.segmentsPrevious[segment].x + (this.segments[segment].x - this.segmentsPrevious[segment].x) * time;
        yEnd = this.segmentsPrevious[segment].y + (this.segments[segment].y - this.segmentsPrevious[segment].y) * time;
        wEnd = Math.cos(Math.PI * ((segment / (this.segments.length - 1)) ** .7 + .5)) * this.thickness * .5;
        dxEnd = yEnd - yStart;
        dyEnd = xStart - xEnd;

        renderer.drawLine(
            xStart + wStart * dxStart / this.spacing,
            yStart + wStart * dyStart / this.spacing,
            Color.WHITE,
            xEnd + wEnd * dxEnd / this.spacing,
            yEnd + wEnd * dyEnd / this.spacing,
            Color.WHITE);
        renderer.drawLine(
            xStart - wStart * dxStart / this.spacing,
            yStart - wStart * dyStart / this.spacing,
            Color.WHITE,
            xEnd - wEnd * dxEnd / this.spacing,
            yEnd - wEnd * dyEnd / this.spacing,
            Color.WHITE);
    }
};