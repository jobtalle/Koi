/**
 * A bug
 * @param {BugBody} body A bug body
 * @param {BugPath} path A bug path
 * @constructor
 */
const Bug = function(body, path) {
    this.body = body;
    this.path = path;
};

/**
 * Update a bug
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function() {

};

/**
 * Render this bug
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @param {Flying} flying The flying objects renderer
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
Bug.prototype.render = function(width, height, flying, air, time) {
    this.body.render(width, height, flying, air, time);

    const spot = this.bugSpots[10];
};

/**
 * Free the bug resources
 */
Bug.prototype.free = function() {
    this.body.free();
};