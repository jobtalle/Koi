/**
 * The koi game
 * @param {Renderer} renderer The renderer
 * @param {Random} random A randomizer
 * @constructor
 */
const Koi = function(renderer, random) {
    this.renderer = renderer;
    this.random = random;
    this.constellation = new Constellation(renderer.getWidth() / 70, renderer.getHeight() / 70);
    this.lastUpdate = new Date();
    // TODO: Atlas capacity may overflow!
    this.atlas = new Atlas(renderer, this.constellation.getCapacity());
    this.spawner = new Spawner(this.constellation);

    // TODO: This is a debug warp
    for (let i = 0; i < 1000; ++i)
        this.update();
};

Koi.prototype.UPDATE_RATE = 1 / 15;

/**
 * Notify that the renderer has resized
 */
Koi.prototype.resize = function() {
    this.constellation.resize(renderer.getWidth() / 70, renderer.getHeight() / 70);
};

/**
 * Update the scene
 */
Koi.prototype.update = function() {
    this.spawner.update(this.UPDATE_RATE, this.atlas, this.random);

    this.lastUpdate = new Date();

    this.constellation.small.update(this.atlas, this.random);
    this.constellation.big.update(this.atlas, this.random);
    this.constellation.river.update(this.atlas, this.random);
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

    this.renderer.getTransform().scale(70, 70);
    // this.renderer.getTransform().translate(1, 2);

    this.constellation.small.render(this.renderer, time);
    this.constellation.big.render(this.renderer, time);
    this.constellation.river.render(this.renderer, time);

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