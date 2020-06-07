/**
 * The slots on a scene on which things can be placed
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Constellation} constellation A constellation to place slots on
 * @param {Random} random A randomizer
 * @constructor
 */
const Slots = function(width, height, constellation, random) {
    this.width = Math.ceil(width / this.RESOLUTION);
    this.height = Math.ceil(height / this.RESOLUTION);
    this.slots = new Array(this.width * this.height);

    for (let y = 0; y < this.height; ++y) for (let x = 0; x < this.width; ++x) {
        const slotX = (x + random.getFloat() * this.RANDOM_RANGE) * this.RESOLUTION;
        const slotY = (y + random.getFloat() * this.RANDOM_RANGE) * this.RESOLUTION;

        if (constellation.contains(slotX, slotY))
            this.slots[x + y * this.width] = null;
        else
            this.slots[x + y * this.width] = new Vector2(slotX, slotY);
    }
};

Slots.prototype.RESOLUTION = .16;
Slots.prototype.RANDOM_RANGE = .8;

/**
 * Sort the slots front to back, after which clearing operations are invalid
 */
Slots.prototype.sort = function() {
    this.slots = this.slots.sort((a, b) => {
        if (a === b)
            return 0;

        if (a === null)
            return 100;

        if (b === null)
            return -100;

        return b.y - a.y
    });
};

/**
 * Clear an oval in the slots array
 * @param {Number} circleX The oval X center
 * @param {Number} circleY The oval Y center
 * @param {Number} xRadius The horizontal radius
 * @param {Number} yRadius The vertical radius
 */
Slots.prototype.clearOval = function(circleX, circleY, xRadius, yRadius) {
    const left = Math.max(0, Math.min(this.width - 1,
        Math.floor((circleX - xRadius) / this.RESOLUTION)));
    const top = Math.max(0, Math.min(this.height - 1,
        Math.floor((circleY - yRadius) / this.RESOLUTION)));
    const right = Math.max(0, Math.min(this.width - 1,
        Math.floor((circleX + xRadius) / this.RESOLUTION)));
    const bottom = Math.max(0, Math.min(this.height - 1,
        Math.floor((circleY + yRadius) / this.RESOLUTION)));

    for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x) {
        const slot = this.slots[x + y * this.width];

        if (!slot)
            continue;

        const dx = slot.x - circleX;
        const dy = (slot.y - circleY) * (xRadius / yRadius);

        if (dx * dx + dy * dy < xRadius * xRadius)
            this.slots[x + y * this.width] = null;
    }
};