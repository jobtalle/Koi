/**
 * The grid on which all objects exist
 * @param {Number} width The grid width
 * @param {Number} height The grid height
 * @constructor
 */
const Grid = function(width, height) {
    this.xCells = Math.ceil(width / this.RESOLUTION);
    this.yCells = Math.ceil(height / this.RESOLUTION);
    this.cells = new Array(this.xCells * this.yCells);
    this.constraints = [];
    this.fishes = [];

    for (let i = 0; i < this.cells.length; ++i)
        this.cells[i] = new Cell();
};

Grid.prototype.RESOLUTION = 1.5;
Grid.prototype.FORCE_CONSTRAINT = .05;

/**
 * Update the grid and its constituents
 */
Grid.prototype.update = function() {
    for (const fish of this.fishes)
        fish.velocityPrevious.set(fish.velocity);

    for (const fish of this.fishes) {
        const proximity = fish.constraint.sample(fish.position);

        if (proximity !== 0) {
            const magnitude = .01 * proximity;

            if (fish.velocity.x * fish.constraint.normal.x + fish.velocity.y * fish.constraint.normal.y < 0) {
                const vxn = fish.velocity.x / fish.speed;
                const vyn = fish.velocity.y / fish.speed;

                if (vyn * fish.constraint.normal.x - vxn * fish.constraint.normal.y) {
                    fish.velocity.x += vyn * magnitude;
                    fish.velocity.y -= vxn * magnitude;
                }
                else {
                    fish.velocity.x -= vyn * magnitude;
                    fish.velocity.y += vxn * magnitude;
                }
            }
            else {
                fish.velocity.x += fish.constraint.normal.x * magnitude;
                fish.velocity.y += fish.constraint.normal.y * magnitude;
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
        let color = Color.BLACK;

        renderer.drawLine(
            (x + 1) * this.RESOLUTION, y * this.RESOLUTION, color,
            (x + 1) * this.RESOLUTION, (y + 1) * this.RESOLUTION, color);
        renderer.drawLine(
            x * this.RESOLUTION, (y + 1) * this.RESOLUTION, color,
            (x + 1) * this.RESOLUTION, (y + 1) * this.RESOLUTION, color);
    }

    for (const constraint of this.constraints)
        constraint.render(renderer);

    for (const fish of this.fishes)
        fish.render(renderer, time);
};

/**
 * Add a fish
 * @param {Fish} fish A fish
 */
Grid.prototype.addFish = function(fish) {
    this.fishes.push(fish);
};

/**
 * Add a constraint
 * @param {Object} constraint A constraint object
 */
Grid.prototype.addConstraint = function(constraint) {
    this.constraints.push(constraint);
};