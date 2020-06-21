/**
 * 3D mesh data
 * @param {Number[]} [vertices] An array of vertex data
 * @param {Number[]} [indices] An array of indices
 * @constructor
 */
const MeshData = function(vertices = [], indices = []) {
    this.vertices = vertices;
    this.indices = indices;
};

/**
 * Get the number of indices in this mesh data
 * @returns {Number} The number of indices
 */
MeshData.prototype.getIndexCount = function() {
    return this.indices.length;
};

/**
 * Get the number of vertex elements in this mesh data
 * @returns {Number} The number of vertex elements
 */
MeshData.prototype.getVertexCount = function() {
    return this.vertices.length;
};

/**
 * Check whether this mesh data is empty
 * @returns {Boolean} A boolean indicating whether this mesh data is empty
 */
MeshData.prototype.empty = function() {
    return this.vertices.length === 0;
};

/**
 * Clear all vertices and indices in this mesh data
 */
MeshData.prototype.clear = function() {
    this.vertices.length = this.indices.length = 0;
};