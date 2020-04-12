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
    this.polygons = [];
    this.fishes = [];
};

Grid.prototype.RESOLUTION = 2;

/**
 * Update the grid and its constituents
 */
Grid.prototype.update = function() {

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

    for (const polygon of this.polygons)
        polygon.render(renderer);

    for (const fish of this.fishes)
        fish.render(renderer, time);
};

/**
 * Add a polygon shape through which
 * @param {Polygon} polygon A polygon shape
 */
Grid.prototype.addPolygon = function(polygon) {
    this.polygons.push(polygon);
};

/**
 * Add a fish
 * @param {Fish} fish A fish
 */
Grid.prototype.addFish = function(fish) {
    this.fishes.push(fish);
};