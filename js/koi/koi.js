/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @param {Random} random A randomizer
 * @constructor
 */
const Koi = function(renderer, random) {
    this.renderer = renderer;
    this.random = random;
    this.grid = new Grid(12, 12);
    this.lastUpdate = new Date();
    this.pond = new Pond(new Circle(new Vector2(6, 6), 5));
    this.capacity = this.pond.getCapacity();
    this.atlas = new Atlas(renderer, this.capacity);
    this.grid.addConstraint(this.pond.constraint);

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
            new PatternShape(0.6),
            this.atlas.getSlot(),
            this.atlas.slotSize);

        this.atlas.write(pattern);

        this.grid.addFish(
            new Fish(
                new Body(pattern, this.atlas.pixelSize, 1.2, .3),
                new Vector2(6 + 6 * (random.getFloat() - .5), 6 + 6 * (random.getFloat() - .5)),
                new Vector2().fromAngle(Math.PI * 2 * random.getFloat()),
                this.pond.constraint)
        );
    }
};

Koi.prototype.UPDATE_RATE = 1 / 15;

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.lastUpdate = new Date();
    this.grid.update(this.random);
};

/**
 * Render the scene
 */
Koi.prototype.render = function() {
    const time = Math.min(.001 * (new Date() - this.lastUpdate) / this.UPDATE_RATE, 1);

    this.renderer.clear();
    this.renderer.transformPush();

    this.renderer.getTransform().scale(75, 75);

    this.grid.render(this.renderer, time);

    this.renderer.transformPop();
    this.renderer.flush();
};

/**
 * Free all resources maintained by the simulation
 */
Koi.prototype.free = function() {
    this.atlas.free();
};