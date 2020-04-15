/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Koi = function(renderer) {
    this.renderer = renderer;
    this.grid = new Grid(12, 12);
    this.time = 0;
    this.pond = new Pond(new Circle(new Vector(6, 6), 5));

    this.grid.addConstraint(this.pond.constraint);

    const fishCount = 6;

    for (let i = 0; i < fishCount; ++i)
        this.grid.addFish(
            new Fish(new Vector(6 + (Math.random() - .5), 6 + (Math.random() - .5)), new Vector(1, 0))
        );
};

Koi.prototype.UPDATE_RATE = 1 / 40;

/**
 * Update the scene
 * @param {Number} timeStep The number of seconds passed since the last update
 */
Koi.prototype.update = function(timeStep) {
    this.time += timeStep;

    while (this.time > this.UPDATE_RATE) {
        this.time -= this.UPDATE_RATE;

        this.grid.update();
    }
};

/**
 * Render the scene
 */
Koi.prototype.render = function() {
    this.renderer.clear();
    this.renderer.transformPush();

    this.renderer.getTransform().scale(64, 64);

    this.grid.render(this.renderer, this.time / this.UPDATE_RATE);

    this.renderer.transformPop();
    this.renderer.flush();
};