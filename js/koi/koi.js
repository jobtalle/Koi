/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @param {Random} random A randomizer
 * @constructor
 */
const Koi = function(renderer, random) {
    this.renderer = renderer;
    this.random = random;
    this.lastUpdate = new Date();
    this.ponds = [
        new Pond(new ConstraintCircle(new Vector2(6, 6), 5)),
        new Pond(new ConstraintArcPath([
            new ConstraintArcPath.Arc(new Vector2(6, 6), 7.5, 0, Math.PI * 0.5),
            new ConstraintArcPath.Arc(new Vector2(21, 6), 7.5, Math.PI, Math.PI * 1.5)
        ], 1.5))
    ];
    this.atlas = new Atlas(renderer, this.getCapacity());

    const fishCount = 20;

    for (let i = 0; i < fishCount; ++i) {
        const lightness = .9;

        const pattern = new Pattern(
            [
                new PatternBase(new Color(lightness, lightness, lightness)),
                new PatternSpots(
                    1.5,
                    new Color(0.8, 0.3, 0.2),
                    new Vector3(Math.random() * 64, Math.random() * 64, Math.random() * 64),
                    new Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize()
                )
            ],
            new PatternShape(0.6, 0.8),
            this.atlas.getSlot(),
            this.atlas.slotSize);

        this.atlas.write(pattern);

        this.ponds[1].addFish(
            new Fish(
                new Body(pattern, this.atlas.pixelSize, 1.2, .3),
                new Vector2(13.5 + 3 * (random.getFloat() - .5), 6 + 3 * (random.getFloat() - .5)),
                new Vector2().fromAngle(Math.PI * 2 * random.getFloat()))
        );
    }
};

Koi.prototype.UPDATE_RATE = 1 / 15;

/**
 * Get the total number of fish this simulation supports
 * @returns {Number} The total fish capacity
 */
Koi.prototype.getCapacity = function() {
    let capacity = 0;

    for (const pond of this.ponds)
        capacity += pond.getCapacity();

    return capacity;
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.lastUpdate = new Date();

    for (const pond of this.ponds)
        pond.update(this.random);
};

/**
 * Render the scene
 */
Koi.prototype.render = function() {
    const time = Math.min(.001 * (new Date() - this.lastUpdate) / this.UPDATE_RATE, 1);

    this.renderer.clear();
    this.renderer.transformPush();

    this.renderer.getTransform().scale(70, 55);

    for (const pond of this.ponds)
        pond.render(this.renderer, time);

    this.renderer.transformPop();
    this.renderer.flush();
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.atlas.free();
};