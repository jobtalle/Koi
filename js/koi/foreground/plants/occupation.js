/**
 * A map to keep track of spatial occupation
 * @param {Number} width The width
 * @param {Number} height The height
 * @param {Number} resolution The resolution
 * @constructor
 */
const Occupation = function(width, height, resolution) {
    this.resolution = resolution;
    this.xCells = Math.ceil(width / resolution);
    this.yCells = Math.ceil(height / resolution);
    this.cells = new Array(this.xCells * this.yCells).fill(0);
};

/**
 * Occupy a part of the map
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} flag The flag for this occupation
 */
Occupation.prototype.occupy = function(x, y, flag) {
    const fx = Math.floor(x / this.resolution);
    const fy = Math.floor(y / this.resolution);
    const xStart = Math.min(this.xCells - 1, Math.max(0, fx - 1));
    const yStart = Math.min(this.yCells - 1, Math.max(0, fy - 1));
    const xEnd = Math.min(this.xCells - 1, Math.max(0, fx + 1));
    const yEnd = Math.min(this.yCells - 1, Math.max(0, fy + 1));

    for (let y = yStart; y <= yEnd; ++y) for (let x = xStart; x <= xEnd; ++x)
        this.cells[x + y * this.xCells] |= flag;
};

/**
 * Check whether a coordinate is occupied
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} flag The flag for this occupation
 * @returns {Number} The given flag if it was encountered at the given coordinates
 */
Occupation.prototype.occupied = function(x, y, flag) {
    const xCell = Math.min(this.xCells - 1, Math.max(0, Math.floor(x / this.resolution)));
    const yCell = Math.min(this.yCells - 1, Math.max(0, Math.floor(y / this.resolution)));

    return this.cells[xCell + yCell * this.xCells] & flag;
};