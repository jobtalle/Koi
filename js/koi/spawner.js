/**
 * The fish spawner
 * @param {Pond} pond A pond to spawn fish in
 * @param {Vector2} point The point to spawn new fish at
 * @param {Vector2} direction The initial direction of spawned fish
 * @constructor
 */
const Spawner = function(pond, point, direction) {
    this.pond = pond;
    this.point = point;
    this.direction = direction;
    this.time = 0;
};

Spawner.prototype.SPAWN_TIME_MIN = 2;
Spawner.prototype.SPAWN_TIME_MAX = 10;

/**
 * Update the spawner
 * @param {Number} timeStep The amount of time passed since the last update
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Random} random A randomizer
 */
Spawner.prototype.update = function(timeStep, atlas, random) {
    if ((this.time -= timeStep) < 0) {
        this.time += this.SPAWN_TIME_MIN + (this.SPAWN_TIME_MAX - this.SPAWN_TIME_MIN) * random.getFloat();

        if (this.pond.canSpawn()) {
            const pattern = new Pattern(
                [
                    new PatternBase(new Color(.9, .9, .9)),
                    new PatternSpots(
                        1.5,
                        new Color(0.8, 0.3, 0.2),
                        new Vector3(Math.random() * 64, Math.random() * 64, Math.random() * 64),
                        new Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize()
                    )
                ],
                new PatternShape(0.6, 0.8),
                atlas.getSlot(), // TODO: atlas.write should assign this information after it becomes valid!
                atlas.slotSize);

            atlas.write(pattern);

            this.pond.addFish(new Fish(
                new Body(pattern, atlas.pixelSize, 1.2, .3),
                this.point,
                this.direction));
        }
    }
};