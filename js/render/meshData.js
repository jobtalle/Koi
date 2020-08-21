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