/**
 * A map containing information on where plants are located in the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Number} slotResolution The normal resolution of slots
 * @constructor
 */
const PlantMap = function(width, height, slotResolution) {
    this.xCells = Math.ceil(width / this.RESOLUTION);
    this.yCells = Math.ceil(height / this.RESOLUTION);
    this.cells = new Array(this.xCells * this.yCells).fill(0);
    this.maxCount = (this.RESOLUTION / slotResolution) * (this.RESOLUTION / slotResolution);
};

PlantMap.prototype.RESOLUTION = .8;

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

/**
 * Map all added plant locations to density values
 */
PlantMap.prototype.toDensity = function() {
    for (let cell = 0, cellCount = this.cells.length; cell < cellCount; ++cell)
        this.cells[cell] = Math.min(1, this.cells[cell] / this.maxCount);
};

/**
 * Sample plant density
 * @param {Number} x The X position in meters
 * @param {Number} y The Y position in meters
 */
PlantMap.prototype.sample = function(x, y) {
    const xCell = Math.max(0, Math.min(this.xCells - 1, Math.floor(x / this.RESOLUTION)));
    const yCell = Math.max(0, Math.min(this.yCells - 1, Math.floor(y / this.RESOLUTION)));

    return this.cells[xCell + yCell * this.xCells];
};