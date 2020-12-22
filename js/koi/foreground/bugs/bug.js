/**
 * A bug
 * @param {BugBody} body A bug body
 * @param {BugPath} path The path leading this bug to its first landing site
 * @constructor
 */
const Bug = function(body, path) {
    this.body = body;
    this.path = null;
    this.flex = new Vector2();
    this.flexPrevious = this.flex.copy();
    this.flexRender = this.flex.copy();
    this.position = this.positionPrevious = this.positionRender = null;
    this.wind = new Vector2();
    this.windPrevious = this.wind.copy();
    this.windRender = this.wind.copy();
    this.windMapped = new Vector2();
    this.flexAngle = 0;
    this.flexAnglePrevious = this.flexAngle;
    this.zStart = 0;
    this.state = this.STATE_PATH;
    this.wait = 0;
    this.proximityDistance = 0;
    this.startSpot = null;
    this.visitedSpots = [];

    this.startPath(path);
};

Bug.prototype.STATE_PATH = 0;
Bug.prototype.STATE_PATH_LEAVE = 1;
Bug.prototype.STATE_IDLE = 2;
Bug.prototype.SPOT_PROXIMITY_DISTANCE = 1.8;
Bug.prototype.IDLE_TIME = new SamplerPower(30, 400, 2.2);

/**
 * Start moving along a path
 * @param {BugPath} path The path
 * @param {BugPathMaker} pathMaker A path maker to recycle previous paths in
 */
Bug.prototype.startPath = function(path, pathMaker) {
    const spot = path.getLastNode().spot;

    if (spot)
        this.visitedSpots.push(spot);

    if (this.path) {
        const previousLastNode = this.path.getLastNode();

        pathMaker.recycle(this.path);

        if (previousLastNode.spot)
            this.zStart = previousLastNode.spot.position.z;
    }
    else
        this.zStart = path.getLastNode().position.z;

    this.position = new Vector3(path.getStart().x, path.getStart().y, this.zStart);
    this.positionPrevious = this.position.copy();
    this.positionRender = this.position.copy();
    this.path = path;
    this.proximityDistance = Math.min(this.SPOT_PROXIMITY_DISTANCE, path.length() * .5);
};

/**
 * Set interpolated spot related properties
 * @param {Vector2} windFrom The wind start position
 * @param {Vector2} windTo The wind start position
 * @param {Vector2} flexFrom The flex start vector
 * @param {Vector2} flexTo The flex end vector
 * @param {Number} flexAngleFrom The flex start angle
 * @param {Number} flexAngleTo The flex end angle
 * @param {Number} f The interpolation factor
 */
Bug.prototype.interpolateSpotProperties = function(
    windFrom, windTo,
    flexFrom, flexTo,
    flexAngleFrom, flexAngleTo,
    f) {
    this.wind.set(windTo).subtract(windFrom).multiply(f).add(windFrom);
    this.flex.set(flexTo).subtract(flexFrom).multiply(f).add(flexFrom);
    this.flexAngle = flexAngleFrom + (flexAngleTo - flexAngleFrom) * f;
};

/**
 * Update a bug
 * @param {BugPathMaker} pathMaker A path maker
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @param {Random} random A randomizer
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function(pathMaker, width, height, random) {
    this.positionPrevious.set(this.position);
    this.flexPrevious.set(this.flex);
    this.windPrevious.set(this.wind);
    this.flexAnglePrevious = this.flexAngle;

    switch (this.state) {
        case this.STATE_PATH:
        case this.STATE_PATH_LEAVE:
            const lastNode = this.path.getLastNode();
            const finishedPath = this.path.move(.072);

            this.body.update(false);

            if (finishedPath) {
                if (this.state === this.STATE_PATH_LEAVE) {
                    pathMaker.recycle(this.path);

                    return true;
                }
                else {
                    this.state = this.STATE_IDLE;
                    this.position.set(lastNode.spot.position);
                    this.startSpot = lastNode.spot;

                    this.wind.set(lastNode.spot.windPosition);
                    this.flex = lastNode.spot.flex;
                    this.flexAngle = lastNode.spot.angle;

                    this.wait = Math.round(this.IDLE_TIME.sample(random.getFloat()));
                }
            }
            else {
                const pathPosition = this.path.getPosition();

                this.position.x = pathPosition.x;
                this.position.y = pathPosition.y;
                this.windMapped.x = this.positionRender.x / width;
                this.windMapped.y = 1 - this.positionRender.y / height;

                if (lastNode.spot)
                    this.position.z = this.zStart + (lastNode.spot.position.z - this.zStart) *
                        (this.path.at / this.path.length());

                if (this.startSpot && this.path.at < this.proximityDistance)
                    this.interpolateSpotProperties(
                        this.startSpot.windPosition, this.windMapped,
                        this.startSpot.flex, this.body.flex,
                        this.startSpot.angle, this.body.flexAngle,
                        this.path.at / this.proximityDistance);
                else if (lastNode.spot && this.path.at > this.path.length() - this.proximityDistance)
                    this.interpolateSpotProperties(
                        lastNode.spot.windPosition, this.windMapped,
                        lastNode.spot.flex, this.body.flex,
                        lastNode.spot.angle, this.body.flexAngle,
                        (this.path.length() - this.path.at) / this.proximityDistance);
                else {
                    this.wind.set(this.windMapped);
                    this.flex.set(this.body.flex);
                    this.flexAngle = this.body.flexAngle;
                }
            }

            break;
        case this.STATE_IDLE:
            if (--this.wait === 0) {
                this.startPath(pathMaker.makeWander(this.position, this.visitedSpots, random), pathMaker);

                if (this.path.getLastNode().spot)
                    this.state = this.STATE_PATH;
                else
                    this.state = this.STATE_PATH_LEAVE;
            }

            this.body.update(true);

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