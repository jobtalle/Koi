/**
 * The slots on a scene on which things can be placed
 * @param {Number} xStart The X start
 * @param {Number} yStart The Y start
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Constellation} constellation A constellation to place slots on
 * @param {Random} random A randomizer
 * @constructor
 */
const Slots = function(
    xStart,
    yStart,
    width,
    height,
    constellation,
    random) {
    this.width = width;
    this.height = height;
    this.cellSize = this.RADIUS / Math.sqrt(2);
    this.xCells = Math.ceil(width / this.cellSize);
    this.yCells = Math.ceil(height / this.cellSize);
    this.cells = new Array(this.xCells * this.yCells).fill(null);
    this.slots = [];

    let active = [];

    const add = slot => {
        const x = Math.floor(slot.x / this.cellSize);
        const y = Math.floor(slot.y / this.cellSize);

        this.cells[x + y * this.xCells] = slot;
        this.slots.push(slot);

        active.push(slot);
    };

    const collides = slot => {
        if (slot.x < 0 || slot.y < 0 || slot.x > width || slot.y > height)
            return true;

        const x = Math.floor(slot.x / this.cellSize);
        const y = Math.floor(slot.y / this.cellSize);
        const xStart = Math.max(0, x - 1);
        const yStart = Math.max(0, y - 1);
        const xEnd = Math.min(this.xCells - 1, xStart + 2);
        const yEnd = Math.min(this.yCells - 1, yStart + 2);

        for (let yCell = yStart; yCell <= yEnd; ++yCell) for (let xCell = xStart; xCell <= xEnd; ++xCell) {
            if (this.cells[xCell + yCell * this.xCells]) {
                const dx = slot.x - this.cells[xCell + yCell * this.xCells].x;
                const dy = slot.y - this.cells[xCell + yCell * this.xCells].y;

                if (dx * dx + dy * dy < this.RADIUS * this.RADIUS)
                    return true;
            }
        }

        return false;
    };

    add(new Vector2(width * random.getFloat(), height * random.getFloat()));

    while (this.slots.length < this.MINIMUM) {
        while (active.length !== 0) {
            const centerIndex = Math.floor(active.length * random.getFloat());
            const center = active[centerIndex];

            for (let i = 0; i < this.MAX_ITERATIONS; ++i) {
                const spotRadius = this.RADIUS + this.RADIUS * random.getFloat();
                const spotRadians = Math.PI * 2 * random.getFloat();
                const spot = new Vector2(
                    center.x + Math.cos(spotRadians) * spotRadius,
                    center.y + Math.sin(spotRadians) * spotRadius);

                if (!collides(spot))
                    add(spot);
            }

            active.splice(centerIndex, 1);
        }

        active = this.slots.slice();
    }
};

Slots.prototype.RADIUS = .16;
Slots.prototype.MAX_ITERATIONS = 20;
Slots.prototype.MINIMUM = 300;

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
    const left = Math.max(0, Math.min(this.xCells - 1,
        Math.floor((circleX - xRadius) / this.cellSize)));
    const top = Math.max(0, Math.min(this.yCells - 1,
        Math.floor((circleY - yRadius) / this.cellSize)));
    const right = Math.max(0, Math.min(this.xCells - 1,
        Math.floor((circleX + xRadius) / this.cellSize)));
    const bottom = Math.max(0, Math.min(this.yCells - 1,
        Math.floor((circleY + yRadius) / this.cellSize)));

    for (let y = top; y <= bottom; ++y) for (let x = left; x <= right; ++x) {
        const slot = this.cells[x + y * this.xCells];

        if (!slot)
            continue;

        const dx = slot.x - circleX;
        const dy = (slot.y - circleY) * (xRadius / yRadius);

        if (dx * dx + dy * dy < xRadius * xRadius) {
            this.cells[x + y * this.xCells] = null;
            this.slots.splice(this.slots.indexOf(slot), 1);
        }
    }
};