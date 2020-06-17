/**
 * The fish spawner
 * @param {Constellation} constellation A constellation to spawn fish in
 * @constructor
 */
const Spawner = function(constellation) {
    this.constellation = constellation;
    this.time = 0;
};

Spawner.prototype.SPAWN_TIME_MIN = 2;
Spawner.prototype.SPAWN_TIME_MAX = 8;
Spawner.prototype.SPAWN_OVERHEAD = 8;

/**
 * Update the spawner
 * @param {Number} timeStep The amount of time passed since the last update
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Random} random A randomizer
 */
Spawner.prototype.update = function(timeStep, atlas, random) {
    if ((this.time -= timeStep) < 0) {
        this.time += this.SPAWN_TIME_MIN + (this.SPAWN_TIME_MAX - this.SPAWN_TIME_MIN) * random.getFloat();

        if (this.constellation.getFishCount() < this.constellation.getCapacity() - this.SPAWN_OVERHEAD) {
            const pattern = new Pattern(
                new PatternBase(Color.fromCSS("fish-base")),
                [
                    new PatternSpots(
                        1.5,
                        Color.fromCSS("fish-spots-orange"),
                        new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                        new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()
                    )
                ],
                new PatternShapeBody(0.6, 0.8),
                new PatternShapeFin());

            atlas.write(pattern);

            this.constellation.river.addFish(new Fish(
                new FishBody(
                    pattern,
                    [
                        new Fin(.2, 1.4, 1), new Fin(.2, 1.4, -1),
                        new Fin(.5, .8, 1), new Fin(.5, .8, -1)
                    ],
                    new Tail(.25),
                    1.2,
                    .3),
                this.constellation.spawnPoint,
                this.constellation.spawnDirection));
        }
    }
};