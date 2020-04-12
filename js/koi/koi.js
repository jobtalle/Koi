/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @constructor
 */
const Koi = function(renderer) {
    this.renderer = renderer;
    this.grid = new Grid(10, 10);
    this.time = 0;

    const vectors = [];
    const polyCount = 8;
    const cx = 6;
    const cy = 6;

    for (let i = 0; i < polyCount; ++i) {
        const angle = Math.PI * 2 * i / polyCount;
        const radius = 5 * (.5 + .5 * Math.random());

        vectors.push(new Vector(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius));
    }


    const pond = new Pond(new Polygon(vectors, true));

    this.grid.addPolygon(pond.polygon);
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

    this.grid.render(this.renderer);

    this.renderer.transformPop();
    this.renderer.flush();
};