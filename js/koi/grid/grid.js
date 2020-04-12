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
 */
Grid.prototype.render = function(renderer) {
    for (const polygon of this.polygons)
        polygon.render(renderer);
};

/**
 * Add a polygon shape through which
 * @param {Polygon} polygon A polygon shape
 */
Grid.prototype.addPolygon = function(polygon) {
    this.polygons.push(polygon);
};