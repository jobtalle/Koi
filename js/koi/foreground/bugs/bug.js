/**
 * A bug
 * @param {BugBody} body A bug body
 * @param {BugPath} path A bug path
 * @constructor
 */
const Bug = function(body, path) {
    this.body = body;
    this.path = path;
    this.position = new Vector3(this.path.getStart().x, this.path.getStart().y, .65);
    this.positionPrevious = this.position.copy();
};

/**
 * Update a bug
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function() {
    const pathPosition = this.path.getPosition();

    this.positionPrevious.set(this.position);
    this.position.x = pathPosition.x;
    this.position.y = pathPosition.y;

    return this.path.move(.05);
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
    this.body.render(
        this.position,
        new Vector2(0, 0),
        new Vector2(0, 0),
        0,
        width,
        height,
        flying,
        air,
        time);
};

/**
 * Free the bug resources
 */
Bug.prototype.free = function() {
    this.body.free();
};