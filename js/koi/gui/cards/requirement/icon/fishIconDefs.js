/**
 * Fish icon SVG definitions
 * @param {HTMLElement} defs The defs element to populate
 * @param {Random} random A randomizer
 * @constructor
 */
const FishIconDefs = function(defs, random) {
    this.makeMask(defs);
    this.makeWildcard(defs);
    this.makePatternsBase(defs);
    this.makePatternsSpots(defs, random);
};

FishIconDefs.prototype = Object.create(FishIconConstants.prototype);
FishIconDefs.prototype.FIN_X = 6;
FishIconDefs.prototype.FIN_Y = 22;
FishIconDefs.prototype.SPOT_CIRCUMFERENCE = 15;
FishIconDefs.prototype.SPOTS_A = [
    new Vector3(.5, .3, .3),
    new Vector3(.7, .7, .25)
];
FishIconDefs.prototype.SPOTS_B = [
    new Vector3(.66, .18, .24),
    new Vector3(.48, .6, .32),
    new Vector3(.5, .95, .2)
];
FishIconDefs.prototype.CLASSES_COLOR = [
    "white",
    "black",
    "gold",
    "orange",
    "red",
    "brown"
];

/**
 * Create a cubic bezier path
 * @param {Vector2[]} points The points on the path
 */
FishIconDefs.prototype.createCubicBezierPath = function(points) {
    const pointCount = points.length;
    const halfway = new Array(points.length);
    const commands = [];

    for (let point = 0; point < pointCount; ++point) {
        const next = point + 1 === pointCount ? 0 : point + 1;

        halfway[point] = new Vector2(
            (points[point].x + points[next].x) * .5,
            (points[point].y + points[next].y) * .5);
    }

    commands.push("M", halfway[0].x, halfway[0].y);

    for (let point = 0; point < pointCount; ++point) {
        const next = point + 1 === pointCount ? 0 : point + 1;

        commands.push("Q", points[next].x, points[next].y, halfway[next].x, halfway[next].y);
    }

    return SVG.createPath(commands);
};

/**
 * Create a blob shaped path
 * @param {Vector2} center The blob center
 * @param {Number} radius The blob radius
 * @param {Random} random A randomizer
 * @returns {SVGPathElement} The blob path element
 */
FishIconDefs.prototype.createBlob = function(center, radius, random) {
    const points = Math.max(Math.round(Math.PI * 2 * radius / this.SPOT_CIRCUMFERENCE), 2);
    const angleOffset = random.getFloat() * 2 * Math.PI / points;
    const radiusInner = radius * Math.cos(Math.PI / points);
    const pathPoints = [];

    for (let point = 0; point < points; ++point) {
        const angleOuter = angleOffset + Math.PI * 2 * (point + .25 * random.getFloat()) / points;
        const angleInner = angleOffset + Math.PI * 2 * (point + .5 + .25 * random.getFloat()) / points;
        const multipliedInner = radiusInner + (radius - radiusInner) * Math.sqrt(random.getFloat());

        pathPoints.push(
            new Vector2().fromAngle(angleOuter).multiply(radius).add(center),
            new Vector2().fromAngle(angleInner).multiply(multipliedInner).add(center));
    }

    return this.createCubicBezierPath(pathPoints);
};

/**
 * Create a path representing the fish body
 * @returns {SVGPathElement} The path element
 */
FishIconDefs.prototype.createBodyPath = function() {
    return SVG.createPath([
        "M", this.WIDTH * .5, 0,
        "C", this.WIDTH, 0, this.WIDTH, this.HEIGHT - this.WIDTH * .5, this.WIDTH * .5, this.HEIGHT,
        "C", 0, this.HEIGHT - this.WIDTH * .5, 0, 0, this.WIDTH * .5, 0
    ]);
};

/**
 * Make the fish mask definition
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makeMask = function(defs) {
    const mask = SVG.createMask();

    SVG.setId(mask, this.ID_MASK);

    mask.appendChild(this.createBodyPath());
    mask.appendChild(SVG.createCircle(this.FIN_X, this.FIN_Y, this.FIN_X));
    mask.appendChild(SVG.createCircle(this.WIDTH - this.FIN_X, this.FIN_Y, this.FIN_X));

    defs.appendChild(mask);
};

/**
 * Make the wildcard pattern definition
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makeWildcard = function(defs) {
    const pattern = SVG.createPattern();
    const element = SVG.createRect(0, 0, this.WIDTH, this.HEIGHT);

    SVG.setId(pattern, this.ID_WILDCARD);

    pattern.appendChild(element);
    defs.appendChild(pattern);
};

/**
 * Make the base pattern definitions
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makePatternsBase = function(defs) {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();
        const element = SVG.createRect(0, 0, this.WIDTH, this.HEIGHT);

        SVG.setId(pattern, this.ID_BASE + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        pattern.appendChild(element);
        defs.appendChild(pattern);
    }
};

/**
 * Make the first spots layer patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {String} id The ID for this layer
 * @param {Vector3[]} spots An array of spots definitions
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsSpotsLayer = function(defs, id, spots, random) {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();

        SVG.setId(pattern, id + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        for (const spot of spots)
            pattern.appendChild(
                this.createBlob(
                    spot.vector2().multiplyVector(new Vector2(this.WIDTH, this.HEIGHT)),
                    spot.z * this.WIDTH,
                    random));

        defs.appendChild(pattern);
    }
};

/**
 * Make the spots patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsSpots = function(defs, random) {
    this.makePatternsSpotsLayer(defs, this.ID_SPOTS_A, this.SPOTS_A, random);
    this.makePatternsSpotsLayer(defs, this.ID_SPOTS_B, this.SPOTS_B, random);
};