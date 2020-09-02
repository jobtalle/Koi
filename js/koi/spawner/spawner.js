/**
 * The fish spawner
 * @param {Constellation} constellation A constellation to spawn fish in
 * @param {SpawnerState} state The state of this spawner
 * @constructor
 */
const Spawner = function(constellation, state) {
    this.constellation = constellation;
    this.state = state;
    this.time = 0;
};

Spawner.prototype.SPAWN_TIME_MIN = 2;
Spawner.prototype.SPAWN_TIME_MAX = 8;
Spawner.prototype.SPAWN_OVERHEAD = 8;
Spawner.prototype.SPAWN_LIMIT = 16;

/**
 * Update the spawner
 * @param {Number} timeStep The amount of time passed since the last update
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
Spawner.prototype.update = function(
    timeStep,
    atlas,
    patterns,
    randomSource,
    random) {
    if ((this.time -= timeStep) < 0) {
        this.time += this.SPAWN_TIME_MIN + (this.SPAWN_TIME_MAX - this.SPAWN_TIME_MIN) * random.getFloat();

        if (this.constellation.getFishCount() < Koi.prototype.FISH_CAPACITY - this.SPAWN_OVERHEAD &&
            this.constellation.river.getFishCount() < this.SPAWN_LIMIT) {
            const pattern = new Pattern(
                new LayerBase(new Palette.Sample().randomize(random)),
                [
                    new LayerSpots(
                        new Plane(
                            new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                            new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
                        new Palette.Sample().randomize(random),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF)
                    ),
                    new LayerStripes(
                        new Plane(
                            new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                            new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
                        new Palette.Sample().randomize(random),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF)
                    ),
                    new LayerRidge(
                        new Plane(
                            new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                            new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
                        new Palette.Sample().randomize(random),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF)
                    ),
                    // new LayerSpots(
                    //     new Plane(
                    //         new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                    //         new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
                    //     new Palette.Sample().randomize(random),
                    //     Math.round(random.getFloat() * 0xFF),
                    //     Math.round(random.getFloat() * 0xFF),
                    //     Math.round(random.getFloat() * 0xFF),
                    //     Math.round(random.getFloat() * 0xFF),
                    //     Math.round(random.getFloat() * 0xFF),
                    //     Math.round(random.getFloat() * 0xFF)
                    // ),
                ],
                new LayerShapeBody(
                    Math.round(random.getFloat() * 0xFF),
                    Math.round(random.getFloat() * 0xFF),
                    Math.round(random.getFloat() * 0xFF)),
                new LayerShapeFin());

            pattern.trim(patterns.palettes.base);

            atlas.write(pattern, randomSource);

            this.constellation.river.addFish(new Fish(
                new FishBody(
                    pattern,
                    [
                        new Fin(.2, 1.4, 1),
                        new Fin(.5, .8, 1)
                    ],
                    new Tail(
                        Math.round(random.getFloat() * 0xFF),
                        Math.round(random.getFloat() * 0xFF)),
                    Math.round(random.getFloat() * 0xFF),
                    Math.round(random.getFloat() * 0xFF)),
                this.constellation.spawnPoint,
                this.constellation.spawnDirection,
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                30000));
        }
    }
};