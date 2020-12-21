/**
 * A bug
 * @param {BugBody} body A bug body
 * @param {BugPath} path The path leading this bug to its first landing site
 * @constructor
 */
const Bug = function(body, path) {
    this.body = body;
    this.path = path;
    this.hover = new BugHover(path.getLastNode().spot.position.z);
    this.flex = new Vector2();
    this.flexPrevious = this.flex.copy();
    this.flexRender = this.flex.copy();
    this.position = new Vector3(this.path.getStart().x, this.path.getStart().y, .65);
    this.positionPrevious = this.position.copy();
    this.positionRender = this.position.copy();
    this.wind = new Vector2();
    this.windPrevious = this.wind.copy();
    this.windRender = this.wind.copy();
    this.flexAngle = 0;
    this.flexAnglePrevious = this.flexAngle;
    this.state = this.STATE_PATH;console.log(path);
    this.spotProximity = 0;
};

Bug.prototype.STATE_PATH = 0;
Bug.prototype.STATE_PATH_LEAVE = 1;
Bug.prototype.STATE_IDLE = 2;
Bug.prototype.SPOT_PROXIMITY_DISTANCE = 1;

/**
 * Update a bug
 * @param {BugPathMaker} pathMaker A path maker
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function(pathMaker, width, height) {
    this.positionPrevious.set(this.position);
    this.flexPrevious.set(this.flex);
    this.windPrevious.set(this.wind);
    this.flexAnglePrevious = this.flexAngle;

    switch (this.state) {
        case this.STATE_PATH:
        case this.STATE_PATH_LEAVE:
            const pathPosition = this.path.getPosition();

            this.position.x = pathPosition.x;
            this.position.y = pathPosition.y;
            this.position.z = this.hover.update();
            this.wind.x = this.positionRender.x / width;
            this.wind.y = 1 - this.positionRender.y / height;
            this.flexAngle = this.body.flexAngle;

            const finishedPath = this.path.move(.05);
            const spotDistance = Math.min(1, this.path.getDistanceLeft() / this.SPOT_PROXIMITY_DISTANCE);

            if (finishedPath) {
                pathMaker.recycle(this.path);

                if (this.state === this.STATE_PATH_LEAVE)
                    return true;
                else {
                    const lastNode = this.path.getLastNode();

                    this.state = this.STATE_IDLE;
                    this.flex = lastNode.spot.flex;
                    this.position.set(lastNode.spot.position);
                    this.wind.set(lastNode.spot.windPosition);
                    this.flexAngle = lastNode.spot.angle;
                }
            }

            break;
        case this.STATE_IDLE:
            // TODO

            break;
    }

    return false;
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
    this.flexRender.set(this.flex).subtract(this.flexPrevious).multiply(time).add(this.flexPrevious);
    this.windRender.set(this.wind).subtract(this.windPrevious).multiply(time).add(this.windPrevious);

    this.body.render(
        this.positionRender,
        this.windRender,
        this.flexRender,
        this.flexAnglePrevious + (this.flexAngle - this.flexAnglePrevious) * time,
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