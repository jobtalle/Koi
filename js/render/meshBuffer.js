/**
 * A flexible mesh buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} stride The vertex stride
 * @constructor
 */
const MeshBuffer = function(gl, stride) {
    this.gl = gl;
    this.stride = 1 / stride;
    this.vertices = [];
    this.indices = [];
    this.bufferVertices = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();
    this.bufferVerticesCapacity = 0;
    this.bufferIndicesCapacity = 0;
    this.indexCount = -1;
};

/**
 * Add vertices to the buffer
 * @param {...Number} vertices Any number of vertices
 */
MeshBuffer.prototype.addVertices = function(...vertices) {
    this.vertices.push(...vertices);
};

/**
 * Add indices to the buffer
 * @param {...Number} indices Any number of indices
 */
MeshBuffer.prototype.addIndices = function(...indices) {
    this.indices.push(...indices);
};

/**
 * Get the number of vertices in this buffer
 */
MeshBuffer.prototype.getVertexCount = function() {
    return this.vertices.length * this.stride;
};

/**
 * Bind the vertex and index buffers of this mesh buffer
 */
MeshBuffer.prototype.bind = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferVertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
};

/**
 * Upload all buffered vertices & indices
 */
MeshBuffer.prototype.upload = function() {
    if (this.vertices.length === 0)
        return;

    this.bind();

    if (this.vertices.length > this.bufferVerticesCapacity) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.DYNAMIC_DRAW);
        this.bufferVerticesCapacity = this.vertices.length;
    }
    else
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.vertices));

    if (this.indices.length > this.bufferIndicesCapacity) {
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.DYNAMIC_DRAW);
        this.bufferIndicesCapacity = this.indices.length;
    }
    else
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.indices));

    this.indexCount = this.indices.length;
    this.vertices.length = this.indices.length = 0;
};

/**
 * Render the contents of this buffer
 */
MeshBuffer.prototype.render = function() {
    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by the buffer
 */
MeshBuffer.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};