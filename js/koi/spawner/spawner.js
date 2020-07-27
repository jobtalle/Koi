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

/**
 * Update the spawner
 * @param {Number} timeStep The amount of time passed since the last update
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
Spawner.prototype.update = function(timeStep, atlas, randomSource, random) {
    if ((this.time -= timeStep) < 0) {
        this.time += this.SPAWN_TIME_MIN + (this.SPAWN_TIME_MAX - this.SPAWN_TIME_MIN) * random.getFloat();

        if (this.constellation.getFishCount() < this.constellation.getCapacity() - this.SPAWN_OVERHEAD) {
            const pattern = new Pattern(
                new LayerBase(new Palette.Sample().randomize(random)),
                [
                    new LayerSpots(
                        1.5,
                        new Palette.Sample().randomize(random),
                        new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                        new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()
                    ),
                    new LayerSpots(
                        3,
                        new Palette.Sample().randomize(random),
                        new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                        new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()
                    )
                ],
                new LayerShapeBody(0.6, 0.7),
                new LayerShapeFin());

            atlas.write(pattern, randomSource);

            this.constellation.river.addFish(new Fish(
                new FishBody(
                    pattern,
                    [
                        new Fin(.2, 1.4, 1),
                        new Fin(.5, .8, 1)
                    ],
                    new Tail(.3),
                    1.2,
                    .15),
                this.constellation.spawnPoint,
                this.constellation.spawnDirection,
                Math.round(random.getFloat() * 0xFF)));
        }
    }
};