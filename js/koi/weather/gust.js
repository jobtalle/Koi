/**
 * A gust of wind
 * @param {Vector2} from The wave front start position
 * @param {Vector2} to The wave front end position
 * @param {Number} distance The distance to move
 * @param {Number} speed The speed
 * @param {Random} random A randomizer
 * @constructor
 */
const Gust = function(from, to, distance, speed, random) {
    this.mesh = this.makeMesh(from, to, random);
    this.distance = distance;
    this.speed = speed;
    this.moved = 0;
};

Gust.prototype.POINT_SPACING = 1.5;
Gust.prototype.RADIUS_LEADING = 1;
Gust.prototype.RADIUS_TRAILING = .5;
Gust.prototype.LAG_AMPLITUDE = 2;
Gust.prototype.LAG_POWER = 2.5;

/**
 * Make the mesh for this gust
 * @param {Vector2} from The wave front start position
 * @param {Vector2} to The wave front end position
 * @returns {MeshData} The mesh data
 * @param {Random} random A randomizer
 */
Gust.prototype.makeMesh = function(from, to, random) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const waveFrontLength = Math.sqrt(dx * dx + dy * dy);
    const pointCount = Math.ceil(waveFrontLength / this.POINT_SPACING) + 1;
    const vertices = new Array(3 * pointCount);
    const indices = [];

    for (let point = 0; point <= pointCount; ++point) {
        const lag = this.LAG_AMPLITUDE * Math.pow(random.getFloat(), this.LAG_POWER);
        const progress = point / pointCount;
        const x = from.x + dx * point / pointCount;
        const y = from.y + dy * point / pointCount;

        vertices[15 * point] = x - lag - this.RADIUS_TRAILING;
        vertices[15 * point + 1] = y;
        vertices[15 * point + 2] = vertices[15 * point + 3] = vertices[15 * point + 4] = 0;
        vertices[15 * point + 5] = x - lag;
        vertices[15 * point + 6] = y;
        vertices[15 * point + 7] = 0;
        vertices[15 * point + 8] = 0;
        vertices[15 * point + 9] = Math.sin(Math.PI * progress) * .1;
        vertices[15 * point + 10] = x - lag + this.RADIUS_LEADING;
        vertices[15 * point + 11] = y;
        vertices[15 * point + 12] = vertices[15 * point + 13] = vertices[15 * point + 14] = 0;

        if (point !== pointCount)
            indices.push(
                3 * point,
                3 * point + 1,
                3 * point + 4,
                3 * point + 4,
                3 * point + 3,
                3 * point,
                3 * point + 1,
                3 * point + 2,
                3 * point + 5,
                3 * point + 5,
                3 * point + 4,
                3 * point + 1);
    }

    return new MeshData(vertices, indices);
};

/**
 * Update the wind gust
 * @param {Air} air The air
 * @returns {Boolean} A boolean indicating whether this wind gust should be removed
 */
Gust.prototype.update = function(air) {
    const scale = air.influences.scale;
    const progress = this.moved / this.distance;
    const intensity = Math.sin(Math.PI * progress);
    const firstIndex = air.influences.meshData.getVertexCount() * .2;

    for (let vertex = 0, vertices = this.mesh.vertices.length; vertex < vertices; vertex += 5)
        air.influences.meshData.vertices.push(
            (this.mesh.vertices[vertex] + this.moved) * scale,
            this.mesh.vertices[vertex + 1] * scale,
            this.mesh.vertices[vertex + 2],
            this.mesh.vertices[vertex + 3],
            this.mesh.vertices[vertex + 4] * intensity);

    for (const index of this.mesh.indices)
        air.influences.meshData.indices.push(index + firstIndex);

    air.influences.hasInfluences = true; // TODO: Not doing this

    this.moved += this.speed;

    return this.moved > this.distance;
};