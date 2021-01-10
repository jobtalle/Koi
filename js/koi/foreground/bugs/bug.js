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
    this.position = new Vector3();
    this.positionPrevious = this.position.copy();
    this.positionRender = this.position.copy();
    this.aim = new Vector3();
    this.wind = new Vector2();
    this.windPrevious = this.wind.copy();
    this.windRender = this.wind.copy();
    this.windMapped = new Vector2();
    this.flexAngle = 0;
    this.flexAnglePrevious = this.flexAngle;
    this.angle = 0;
    this.anglePrevious = this.angle;
    this.angleTarget = this.angle;
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
Bug.prototype.IDLE_TIME = new SamplerPower(20, 60, 2.5);
Bug.prototype.IDLE_CHANCE_ROTATE = .75;
Bug.prototype.IDLE_CHANCE_HOP = Bug.prototype.IDLE_CHANCE_ROTATE + .15;
Bug.prototype.DRIZZLE_CHANCE_ROTATE = .92;
Bug.prototype.DRIZZLE_CHANCE_HOP = Bug.prototype.DRIZZLE_CHANCE_ROTATE + .05;
Bug.prototype.ANGLE_APPROACH = .6;
Bug.prototype.AIM_DELTA = .8;

/**
 * Start moving along a path
 * @param {BugPath} path The path
 * @param {BugPathMaker} [pathMaker] A path maker to recycle previous paths in
 */
Bug.prototype.startPath = function(path, pathMaker = null) {
    const spot = path.getLastNode().spot;

    if (spot)
        this.visitedSpots.push(spot);

    if (this.path)
        pathMaker.recycle(this.path);

    path.sample(this.position);
    this.positionPrevious.set(this.position);

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
 * Displace this bug into a certain direction
 * @param {BugPathMaker} pathMaker The path maker
 * @param {Number} direction The displacement direction
 * @param {Random} random A randomizer
 */
Bug.prototype.displace = function(pathMaker, direction, random) {
    if (this.state === this.STATE_IDLE)
        this.wander(pathMaker, random, new Vector2().fromAngle(direction), true);
};

/**
 * Set the wait timer to a new value
 * @param {Random} random A randomizer
 */
Bug.prototype.setWait = function(random) {
    this.wait = Math.round(this.IDLE_TIME.sample(random.getFloat()));
};

/**
 * Rotate the bug
 * @param {Random} random A randomizer
 */
Bug.prototype.rotate = function(random) {
    this.setWait(random);

    this.angleTarget = this.body.rotation.sample(random.getFloat());
};

/**
 * Hop to a nearby plant
 * @param {BugPathMaker} pathMaker The path maker
 * @param {Random} random A randomizer
 * @returns {Boolean} True if the hop succeeded
 */
Bug.prototype.hop = function(pathMaker, random) {
    const hopPath = pathMaker.makeHop(this.position, this.visitedSpots, random);

    if (hopPath) {
        this.startPath(hopPath, pathMaker);
        this.state = this.STATE_PATH;

        return true;
    }

    return false;
};

/**
 * Wander
 * @param {BugPathMaker} pathMaker The path maker
 * @param {Random} random A randomizer
 * @param {Vector2} [direction] The initial direction
 * @param {Boolean} [skipApproach] True if a neat escape path should be skipped
 */
Bug.prototype.wander = function(
    pathMaker,
    random,
    direction = null,
    skipApproach = false) {
    this.startPath(pathMaker.makeWander(
        this.position,
        this.visitedSpots,
        direction || new Vector2().fromAngle(this.angle),
        skipApproach,
        random), pathMaker);

    if (this.path.getLastNode().spot)
        this.state = this.STATE_PATH;
    else
        this.state = this.STATE_PATH_LEAVE;
};

/**
 * Leave the scene
 * @param {BugPathMaker} pathMaker The path maker
 * @param {Random} random A randomizer
 */
Bug.prototype.leave = function(
    pathMaker,
    random) {
    this.startPath(pathMaker.makeLeave(
        this.position,
        pathMaker.getExitVector(this.position.vector2()),
        random), pathMaker);

    this.state = this.STATE_PATH_LEAVE;
};

/**
 * Update a bug
 * @param {BugPathMaker} pathMaker A path maker
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @param {WeatherState} weatherState True if the weather conditions are bad
 * @param {Random} random A randomizer
 * @returns {Boolean} True if the bug may be deleted
 */
Bug.prototype.update = function(
    pathMaker,
    width,
    height,
    weatherState,
    random) {
    this.positionPrevious.set(this.position);
    this.flexPrevious.set(this.flex);
    this.windPrevious.set(this.wind);
    this.flexAnglePrevious = this.flexAngle;
    this.anglePrevious = this.angle;

    let angleDelta = this.angleTarget - this.angle;

    if (angleDelta > Math.PI)
        angleDelta -= Math.PI * 2;
    else if (angleDelta < -Math.PI)
        angleDelta += Math.PI * 2;

    this.angle += angleDelta * this.ANGLE_APPROACH;

    switch (this.state) {
        case this.STATE_PATH:
        case this.STATE_PATH_LEAVE:
            const lastNode = this.path.getLastNode();
            const proximityStart = Math.min(1, this.path.at / this.proximityDistance);
            const proximityEnd = Math.min(1, (this.path.length() - this.path.at) / this.proximityDistance);
            const finishedPath = this.path.move(this.body.speed.sample(Math.min(proximityStart, proximityEnd)));

            this.body.update(false, random);

            if (finishedPath) {
                if (this.state === this.STATE_PATH_LEAVE) {
                    pathMaker.recycle(this.path);

                    return true;
                }
                else {
                    this.state = this.STATE_IDLE;
                    this.startSpot = lastNode.spot;

                    this.position.set(lastNode.spot.position);
                    this.wind.set(lastNode.spot.windPosition);
                    this.flex.set(lastNode.spot.flex);
                    this.flexAngle = lastNode.spot.angle;

                    this.wait = Math.round(this.IDLE_TIME.sample(random.getFloat()));
                }
            }
            else {
                this.path.sample(this.aim, this.AIM_DELTA);
                this.path.sample(this.position);
                this.windMapped.x = this.positionRender.x / width;
                this.windMapped.y = 1 - this.positionRender.y / height;
                this.angleTarget = Math.atan2(this.position.x - this.aim.x, this.position.y - this.aim.y);

                if (this.startSpot && this.path.at < this.proximityDistance)
                    this.interpolateSpotProperties(
                        this.startSpot.windPosition, this.windMapped,
                        this.startSpot.flex, this.body.flex,
                        this.startSpot.angle, this.body.flexAngle,
                        proximityStart);
                else if (lastNode.spot && this.path.at > this.path.length() - this.proximityDistance)
                    this.interpolateSpotProperties(
                        lastNode.spot.windPosition, this.windMapped,
                        lastNode.spot.flex, this.body.flex,
                        lastNode.spot.angle, this.body.flexAngle,
                        proximityEnd);
                else {
                    this.wind.set(this.windMapped);
                    this.flex.set(this.body.flex);
                    this.flexAngle = this.body.flexAngle;
                }
            }

            break;
        case this.STATE_IDLE:
            if (--this.wait === 0) {
                if (this.body.resistant || !weatherState.isRaining()) {
                    const r = random.getFloat();

                    if (!this.body.resistant && weatherState.isDrizzle()) {
                        if (r < this.DRIZZLE_CHANCE_ROTATE)
                            this.rotate(random);
                        else if (r < this.DRIZZLE_CHANCE_HOP) {
                            if (!this.hop(pathMaker, random))
                                this.leave(pathMaker, random);
                        }
                        else
                            this.leave(pathMaker, random);
                    }
                    else {
                        if (r < this.IDLE_CHANCE_ROTATE)
                            this.rotate(random);
                        else if (r < this.IDLE_CHANCE_HOP) {
                            if (!this.hop(pathMaker, random))
                                this.wander(pathMaker, random);
                        }
                        else
                            this.wander(pathMaker, random);
                    }
                }
                else
                    this.leave(pathMaker, random);
            }

            this.body.update(true, random);

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

    let angleDelta = this.angle - this.anglePrevious;

    if (angleDelta > Math.PI)
        angleDelta -= Math.PI * 2;
    else if (angleDelta < -Math.PI)
        angleDelta += Math.PI * 2;

    const angleRender = this.anglePrevious + angleDelta * time;

    this.body.render(
        this.positionRender,
        this.windRender,
        this.flexRender,
        this.flexAnglePrevious + (this.flexAngle - this.flexAnglePrevious) * time,
        angleRender,
        width,
        height,
        flying,
        air,
        time);
};

/**
 * Free the bug resources
 * @param {BugPathMaker} [pathMaker] An optional path maker if bug paths should be recycled
 */
Bug.prototype.free = function(pathMaker = null) {
    this.body.free();

    if (pathMaker && this.path)
        pathMaker.recycle(this.path);
};