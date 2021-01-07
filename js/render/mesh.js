/**
 * A generic indexed mesh
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {MeshData} meshData The mesh data
 * @param {Number} [indexBytes] The number of bytes per index, either 1, 2 or 4, 2 by default
 * @constructor
 */
const Mesh = function(
    gl,
    meshData,
    indexBytes = 2) {
    this.gl = gl;
    this.indexFormat = this.getIndexFormat(gl, indexBytes);
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.elementCount = meshData.getIndexCount();

    gl.vao.bindVertexArrayOES(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

    switch (this.indexFormat) {
        case gl.UNSIGNED_BYTE:
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(meshData.indices), gl.STATIC_DRAW);

            break;
        case gl.UNSIGNED_SHORT:
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshData.indices), gl.STATIC_DRAW);

            break;
        case gl.UNSIGNED_INT:
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(meshData.indices), gl.STATIC_DRAW);

            break;
    }
};

/**
 * Get the valid WebGL index format constant
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} bytes The number of bytes per index, either 1, 2 or 4
 */
Mesh.prototype.getIndexFormat = function(gl, bytes) {
    switch (bytes) {
        case 1:
            return gl.UNSIGNED_BYTE;
        case 2:
        default:
            return gl.UNSIGNED_SHORT;
        case 4:
            return gl.UNSIGNED_INT;
    }
};

/**
 * Bind the buffers
 */
Mesh.prototype.bindBuffers = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indices);
};

/**
 * Free all resources maintained by this mesh
 */
Mesh.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
};
