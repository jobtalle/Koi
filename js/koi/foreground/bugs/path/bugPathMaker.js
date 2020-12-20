/**
 * A bug path maker
 * @param {Constellation} constellation The constellation
 * @param {BugSpot[]} bugSpots Bug spots
 * @constructor
 */
const BugPathMaker = function(constellation, bugSpots) {
    this.constellation = constellation;
    this.bugSpots = bugSpots;
};

BugPathMaker.prototype.EDGE_PADDING = 1.2;

/**
 * Get a random bug spot from the pool
 * @param {Random} random A randomizer
 * @returns {BugSpot} A bug spot, or null if no bug spots are available
 */
BugPathMaker.prototype.getSpot = function(random) {
    if (this.bugSpots.length === 0)
        return null;

    return this.bugSpots.splice(Math.floor(this.bugSpots.length * random.getFloat()), 1)[0];
};

/**
 * Return a bug spot to the pool
 * @param {BugSpot} spot The bug spot to return
 */
BugPathMaker.prototype.returnSpot = function(spot) {
    this.bugSpots.push(spot);
    console.log("Recycle!");
};

/**
 * Get a vector pointing towards the closest exit
 * @param {Vector2} position The position to create an exit vector for
 * @returns {Vector2} A unit vector pointing towards the closest edge
 */
BugPathMaker.prototype.getExitVector = function(position) {
    const nx = position.x / this.constellation.width;
    const ny = position.y / this.constellation.height;

    if (nx > ny) {
        if (1 - ny > nx)
            return new Vector2(0, 1);
        else
            return new Vector2(1, 0);
    }
    else {
        if (1 - ny > nx)
            return new Vector2(-1, 0);
        else
            return new Vector2(0, -1);
    }
};

/**
 * Recycle the occupied nodes in a previously created path
 * @param {BugPath} path The path to recycle
 */
BugPathMaker.prototype.recycle = function(path) {
    for (const node of path.nodes) if (node instanceof BugPathNodeSpot)
        this.returnSpot(node.spot);
};

/**
 * Make an entrance path
 * @param {Random} random A randomizer
 * @returns {BugPath} A bug path to a spot starting outside the view, or null when no empty spots were available
 */
BugPathMaker.prototype.makeEntrance = function(random) {
    const target = this.getSpot(random);

    if (!target)
        return null;

    return new BugPath([
        new BugPathNodeAir(new Vector3(-this.EDGE_PADDING, 5, 1)),
        new BugPathNodeSpot(target)
    ]);
};

BugPathMaker.prototype.makeWander = function(direction, random) {

};

BugPathMaker.prototype.makeLeave = function(random) {

};