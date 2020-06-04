/**
 * A generic indexed mesh
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number[]} vertices An array of vertices
 * @param {Number[]} indices An array of indices
 * @param {Boolean} [longIndices] A boolean indicating whether to use 32 bit indices, false by default
 * @constructor
 */
const Mesh = function(
    gl,
    vertices,
    indices,
    longIndices = false) {
    this.gl = gl;
    this.indexFormat = longIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.elementCount = indices.length;

    gl.vao.bindVertexArrayOES(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

    if (longIndices)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);
    else
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
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
