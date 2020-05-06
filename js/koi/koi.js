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
    this.spawner = new Spawner(this.ponds[1], new Vector2(6.1, 6 + 7.5), new Vector2(1, 0));
};

Koi.prototype.UPDATE_RATE = 1 / 15;

/**
 * Get the total number of fish this simulation supports
 * @returns {Number} The total fish capacity
 */
Koi.prototype.getCapacity = function() {
    let capacity = 0;

    for (const pond of this.ponds)
        capacity += pond.capacity;

    return capacity;
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.random);

    this.lastUpdate = new Date();

    for (const pond of this.ponds)
        pond.update(this.atlas, this.random);
};

/**
 * Render the scene
 */
Koi.prototype.render = function() {
    let time = .001 * (new Date() - this.lastUpdate) / this.UPDATE_RATE;

    while (time > 1) {
        time -= 1;

        this.update();
    }

    this.renderer.clear();
    this.renderer.transformPush();

    this.renderer.getTransform().scale(70, 55);

    for (const pond of this.ponds)
        pond.render(this.renderer, time);

    this.renderer.transformPop();

    // this.renderer.cutStrip(0, 0, 0, 0);
    // this.renderer.drawStrip(0, 800,0, 1);
    // this.renderer.cutStrip(800, 800,1, 1);
    // this.renderer.cutStrip(0, 0, 0, 0);
    // this.renderer.drawStrip(800, 0,1, 0);
    // this.renderer.cutStrip(800, 800,1, 1);

    this.renderer.flush();
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.atlas.free();
};