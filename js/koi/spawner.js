/**
 * The fish spawner
 * @param {Constellation} constellation A constellation to spawn fish in
 * @constructor
 */
const Spawner = function(constellation) {
    this.constellation = constellation;
    this.time = 0;
};

Spawner.prototype.SPAWN_TIME_MIN = 1;
Spawner.prototype.SPAWN_TIME_MAX = 5;
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
                new PatternBase(new Color(.9, .9, .9)),
                [
                    new PatternSpots(
                        1.5,
                        new Color(0.8, 0.3, 0.2),
                        new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                        new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()
                    )
                ],
                new PatternShapeBody(0.6, 0.8),
                new PatternShapeFin());

            atlas.write(pattern);

            this.constellation.river.addFish(new Fish(
                new Body(
                    pattern,
                    [
                        new Fin(.2, 1.4, 1), new Fin(.2, 1.4, -1),
                        new Fin(.5, .8, 1), new Fin(.5, .8, -1)
                    ],
                    1.2,
                    .3),
                this.constellation.spawnPoint,
                this.constellation.spawnDirection));
        }
    }
};