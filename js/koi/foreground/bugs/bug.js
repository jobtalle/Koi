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
    this.positionRender = this.position.copy();
    this.wind = new Vector2();
};

/**
 * Update a bug
 * @param {BugPathMaker} pathMaker A path maker
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function(pathMaker) {
    const pathPosition = this.path.getPosition();

    this.positionPrevious.set(this.position);
    this.position.x = pathPosition.x;
    this.position.y = pathPosition.y;

    const finishedPath = this.path.move(.05);

    // TODO: Rest or cue new path

    if (finishedPath) {
        pathMaker.recycle(this.path);

        return true;
    }
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
    this.positionRender.set(this.position).subtract(this.positionPrevious).multiply(time).add(this.positionPrevious);
    this.wind.x = this.positionRender.x / width;
    this.wind.y = 1 - this.positionRender.y / height;

    this.body.render(
        this.positionRender,
        this.wind,
        this.body.flex,
        this.body.flexAngle,
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