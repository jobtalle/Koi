/**
 * The grid on which all objects exist
 * @param {Number} width The grid width
 * @param {Number} height The grid height
 * @constructor
 */
const Grid = function(width, height) {
    this.width = width;
    this.height = height;
    this.xCells = Math.ceil(width / this.RESOLUTION);
    this.yCells = Math.ceil(height / this.RESOLUTION);
    this.lines = [];
    this.fishes = [];
};

Grid.prototype.RESOLUTION = 2;

/**
 * Update the grid and its constituents
 */
Grid.prototype.update = function() {
    for (const fish of this.fishes)
        fish.velocityPrevious.set(fish.velocity);

    for (const fish of this.fishes) {
        let rx = 0;
        let ry = 0;
        let magnitude = 0;

        for (const line of this.lines) {
            const dx = fish.position.x - line.a.x;
            const dy = fish.position.y - line.a.y;
            let distance = line.direction.x * dx + line.direction.y * dy;

            if (distance < 0)
                distance = 0;
            else if (distance > line.length)
                distance = line.length;

            const px = line.a.x + line.direction.x * distance;
            const py = line.a.y + line.direction.y * distance;

            const pdx = fish.position.x - px;
            const pdy = fish.position.y - py;
            const pd = Math.sqrt(pdx * pdx + pdy * pdy);

            const lineWidth = 1.5;

            if (pd < lineWidth) {
                const acceleration = .002;
                const force = acceleration * pd / lineWidth;

                magnitude += force;
                rx += force * pdx / pd;
                ry += force * pdy / pd;
            }
        }

        if (magnitude !== 0) {
            if (fish.velocity.x * rx + fish.velocity.y * ry < 0) {
                const velocityMagnitude = fish.velocity.length();
                const vxn = fish.velocity.x / velocityMagnitude;
                const vyn = fish.velocity.y / velocityMagnitude;

                if (vyn * rx - vxn * ry > 0) {
                    fish.velocity.x += vyn * magnitude;
                    fish.velocity.y -= vxn * magnitude;
                }
                else {
                    fish.velocity.x -= vyn * magnitude;
                    fish.velocity.y += vxn * magnitude;
                }
            }
            else {
                fish.velocity.x += rx;
                fish.velocity.y += ry;
            }
        }
    }

    for (const fish of this.fishes)
        fish.update();
};

/**
 * Render the grid for debugging
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Grid.prototype.render = function(renderer, time) {
    for (let y = 0; y < this.yCells; ++y) for (let x = 0; x < this.xCells; ++x) {
        renderer.drawLine(
            (x + 1) * this.RESOLUTION, y * this.RESOLUTION, Color.BLACK,
            (x + 1) * this.RESOLUTION, (y + 1) * this.RESOLUTION, Color.BLACK);
        renderer.drawLine(
            x * this.RESOLUTION, (y + 1) * this.RESOLUTION, Color.BLACK,
            (x + 1) * this.RESOLUTION, (y + 1) * this.RESOLUTION, Color.BLACK);
    }

    for (const line of this.lines)
        renderer.drawLine(
            line.a.x, line.a.y, Color.WHITE,
            line.b.x, line.b.y, Color.WHITE);

    for (const fish of this.fishes)
        fish.render(renderer, time);
};

/**
 * Add a polygon shape through which
 * @param {Polygon} polygon A polygon shape
 */
Grid.prototype.addPolygon = function(polygon) {
    for (let vector = 0; vector < polygon.vectors.length - 1; ++vector)
        this.lines.push(new Line(
            polygon.vectors[vector],
            polygon.vectors[vector + 1]));

    if (polygon.closed)
        this.lines.push(new Line(
            polygon.vectors[polygon.vectors.length - 1],
            polygon.vectors[0]));
};

/**
 * Add a fish
 * @param {Fish} fish A fish
 */
Grid.prototype.addFish = function(fish) {
    this.fishes.push(fish);
};