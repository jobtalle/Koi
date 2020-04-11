/**
 * A mesh
 * @constructor
 */
const Mesh = function() {
    this.vertices = [];
    this.indices = [];
    this.bufferVertices = null;
    this.bufferIndices = null;
    this.updated = false;
};

/**
 * Add indices
 * @param {...Number} index Any number of indices
 */
Mesh.prototype.addIndices = function(index) {
    this.indices.push(...arguments);
};

/**
 * Add vertices
 * @param {Sprite} sprite The sprite to use as a mesh texture
 * @param {Number} frame The sprite frame to use as a mesh texture
 * @param {...Number} vertices Vertex data in the order x, y, u, v
 */
Mesh.prototype.addVertices = function(sprite, frame, vertices) {
    const frameData = sprites[sprite]["frames"][frame];
    const uStart = frameData["uStart"];
    const uSize = frameData["uEnd"] - uStart;
    const vStart = frameData["vStart"];
    const vSize = frameData["vEnd"] - vStart;

    for (let i = 2; i < arguments.length; i += 4)
        this.vertices.push(
            arguments[i],
            arguments[i + 1],
            uStart + uSize * arguments[i + 2],
            vStart + vSize * arguments[i + 3]);
};