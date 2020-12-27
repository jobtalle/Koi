/**
 * Fish icon SVG definitions
 * @param {HTMLElement} defs The defs element to populate
 * @param {Random} random A randomizer
 * @constructor
 */
const FishIconDefs = function(defs, random) {
    this.makeBackground(defs);
    this.makeMask(defs);
    this.makeWildcard(defs);
    this.makePatternsBase(defs);
    this.makePatternsSpots(defs, random);
    this.makePatternsStripes(defs, random);
    this.makePatternsRidge(defs, random);
};

FishIconDefs.prototype = Object.create(FishIconConstants.prototype);
FishIconDefs.prototype.BACKGROUND_BEAMS = 6;
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
FishIconDefs.prototype.STRIPES_A = [
    new Vector3(.5, .16, .3),
    new Vector3(.7, .21, .5),
    new Vector3(.5, .16, .7)
];
FishIconDefs.prototype.STRIPES_B = [
    new Vector3(.4, .11, .2),
    new Vector3(.65, .16, .4),
    new Vector3(.65, .16, .6),
    new Vector3(.4, .11, .8)
];
FishIconDefs.prototype.RIDGE_A = new Vector2(.5, .9);
FishIconDefs.prototype.RIDGE_B = new Vector2(.25, .82);
FishIconDefs.prototype.RIDGE_SPACING = 5;
FishIconDefs.prototype.RIDGE_MAX_SHRINK = .5;
FishIconDefs.prototype.STRIPE_CURVE_ANGLE = new Sampler(Math.PI * .3, Math.PI * .7);
FishIconDefs.prototype.CLASSES_COLOR = [
    "white",
    "black",
    "gold",
    "orange",
    "red",
    "brown"
];

/**
 * Create a quadratic bezier path
 * @param {Vector2[]} points The points on the path
 */
FishIconDefs.prototype.createQuadraticBezierPath = function(points) {
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

    return this.createQuadraticBezierPath(pathPoints);
};

/**
 * Create a stripe shaped path
 * @param {Vector2} center The stripe center
 * @param {Number} width The stripe width
 * @param {Number} thickness The stripe thickness
 * @param {Random} random A randomizer
 * @returns {SVGPathElement} The blob path element
 */
FishIconDefs.prototype.createStripe = function(center, width, thickness, random) {
    const angleLeft = this.STRIPE_CURVE_ANGLE.sample(random.getFloat());
    const angleRight = this.STRIPE_CURVE_ANGLE.sample(random.getFloat());

    return SVG.createPath([
        "M",
        center.x - width * .5,
        center.y,
        "C",
        center.x - width * .5 + Math.cos(angleLeft) * thickness * .5,
        center.y + Math.sin(angleLeft) * thickness * .5,
        center.x + width * .5 + Math.cos(angleRight) * thickness * .5,
        center.y + Math.sin(angleRight) * thickness * .5,
        center.x + width * .5,
        center.y,
        "C",
        center.x + width * .5 - Math.cos(angleRight) * thickness * .5,
        center.y - Math.sin(angleRight) * thickness * .5,
        center.x - width * .5 - Math.cos(angleLeft) * thickness * .5,
        center.y - Math.sin(angleLeft) * thickness * .5,
        center.x - width * .5,
        center.y
    ]);
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
 * Make the background image for card slots
 * @param {HTMLElement} defs The defs element to populate
 */
FishIconDefs.prototype.makeBackground = function(defs) {
    const background = SVG.createPattern();
    const radius = this.BACKGROUND_RADIUS * 2;
    const beamWidth = Math.PI / this.BACKGROUND_BEAMS;

    for (let beam = 0; beam < this.BACKGROUND_BEAMS; ++beam) {
        const angle = Math.PI * 2 * beam / this.BACKGROUND_BEAMS;

        background.appendChild(SVG.createPath([
            "M",
            this.BACKGROUND_RADIUS,
            this.BACKGROUND_RADIUS,
            "L",
            this.BACKGROUND_RADIUS + Math.cos(angle + beamWidth * .5) * radius,
            this.BACKGROUND_RADIUS + Math.sin(angle + beamWidth * .5) * radius,
            "L",
            this.BACKGROUND_RADIUS + Math.cos(angle - beamWidth * .5) * radius,
            this.BACKGROUND_RADIUS + Math.sin(angle - beamWidth * .5) * radius,
            "Z"
        ]))
    }

    SVG.setId(background, this.ID_BACKGROUND);

    defs.appendChild(background);
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
 * Make the spots layer patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {String} id The ID for this layer
 * @param {Vector3[]} spots An array of spots definitions
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsSpotsLayer = function(defs, id, spots, random) {
    const dimensions = new Vector2(this.WIDTH, this.HEIGHT);

    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();

        SVG.setId(pattern, id + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        for (const spot of spots)
            pattern.appendChild(
                this.createBlob(
                    spot.vector2().multiplyVector(dimensions),
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

/**
 * Make the stripes layer patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {String} id The ID for this layer
 * @param {Vector2[]} stripes An array of stripe definitions
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsStripesLayer = function(defs, id, stripes, random) {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();

        SVG.setId(pattern, id + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        for (const stripe of stripes)
            pattern.appendChild(this.createStripe(
                new Vector2(this.WIDTH * .5, stripe.z * this.HEIGHT),
                stripe.x * this.WIDTH,
                stripe.y * this.HEIGHT,
                random));

        defs.appendChild(pattern);
    }
};

/**
 * Make the stripes patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsStripes = function(defs, random) {
    this.makePatternsStripesLayer(defs, this.ID_STRIPES_A, this.STRIPES_A, random);
    this.makePatternsStripesLayer(defs, this.ID_STRIPES_B, this.STRIPES_B, random);
};

/**
 * Make the ridge layer patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {String} id The ID for this layer
 * @param {Vector2} ridge The ridge size
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsRidgeLayer = function(defs, id, ridge, random) {
    for (let paletteIndex = 0, colors = Palette.COLORS.length; paletteIndex < colors; ++paletteIndex) {
        const pattern = SVG.createPattern();
        const pathPoints = [
            new Vector2(this.WIDTH * .5, this.HEIGHT * (.5 - ridge.y * .5)),
            new Vector2(this.WIDTH * .5, this.HEIGHT * (.5 + ridge.y * .5))];
        const steps = Math.ceil(ridge.y * this.HEIGHT / this.RIDGE_SPACING);

        for (let step = 1; step < steps; ++step) {
            const mx = Math.sin(Math.PI * step / steps);

            pathPoints.splice(step, 0, new Vector2(
                this.WIDTH * (.5 + mx * ridge.x * .5 * (1 - random.getFloat() * this.RIDGE_MAX_SHRINK)),
                step * this.HEIGHT * ridge.y / steps));
            pathPoints.push(new Vector2(
                this.WIDTH * (.5 - mx * ridge.x * .5 * (1 - random.getFloat() * this.RIDGE_MAX_SHRINK)),
                (steps - step + 1) * this.HEIGHT * ridge.y / steps));
        }

        SVG.setId(pattern, id + paletteIndex.toString());
        SVG.setClass(pattern, this.CLASSES_COLOR[paletteIndex]);

        pattern.appendChild(this.createQuadraticBezierPath(pathPoints));

        defs.appendChild(pattern);
    }
};

/**
 * Make the ridge patterns
 * @param {HTMLElement} defs The defs element to populate
 * @param {Random} random A randomizer
 */
FishIconDefs.prototype.makePatternsRidge = function(defs, random) {
    this.makePatternsRidgeLayer(defs, this.ID_RIDGE_A, this.RIDGE_A, random);
    this.makePatternsRidgeLayer(defs, this.ID_RIDGE_B, this.RIDGE_B, random);
};
