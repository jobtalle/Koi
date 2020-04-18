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
    this.pond = new Pond(new Circle(new Vector(6, 6), 5));

    this.grid.addConstraint(this.pond.constraint);

    const fishCount = 20;

    for (let i = 0; i < fishCount; ++i)
        this.grid.addFish(
            new Fish(
                new Vector(6 + 6 * (random.getFloat() - .5), 6 + 6 * (random.getFloat() - .5)),
                new Vector().fromAngle(Math.PI * 2 * random.getFloat()),
                this.pond.constraint)
        );
};

Koi.prototype.UPDATE_RATE = 1 / 20;

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