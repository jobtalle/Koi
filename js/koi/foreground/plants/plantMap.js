/**
 * A map containing information on where plants are located in the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const PlantMap = function(width, height) {
    this.xCells = Math.ceil(width / this.RESOLUTION);
    this.yCells = Math.ceil(height / this.RESOLUTION);
    this.cells = new Array(this.xCells * this.yCells).fill(0);
};

PlantMap.prototype.RESOLUTION = .5;

/**
 * Add a plant to the map
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
PlantMap.prototype.add = function(x, y) {
    const xCell = Math.max(0, Math.min(this.xCells - 1, Math.floor(x / this.RESOLUTION)));
    const yCell = Math.max(0, Math.min(this.yCells - 1, Math.floor(y / this.RESOLUTION)));

    ++this.cells[xCell + yCell * this.xCells];
};