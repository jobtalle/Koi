/**
 * A flexible mesh buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} stride The vertex inverseStride
 * @constructor
 */
const MeshBuffer = function(gl, stride) {
    this.gl = gl;
    this.inverseStride = 1 / stride;
    this.bufferVertices = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();
    this.bufferVerticesCapacity = 0;
    this.bufferIndicesCapacity = 0;
    this.uploadedIndices = 0;

    this.capacityVertices = this.BLOCK_SIZE;
    this.capacityIndices = this.BLOCK_SIZE;
    this.indexVertices = 0;
    this.indexIndices = 0;
    this.verticesShrinkTime = 0;
    this.indicesShrinkTime = 0;

    this.vertices = new Float32Array(this.capacityVertices);
    this.indices = new Uint16Array(this.capacityIndices);
};

MeshBuffer.prototype.BLOCK_SIZE = 512;
MeshBuffer.prototype.SHRINK_THRESHOLD = MeshBuffer.prototype.BLOCK_SIZE << 2;
MeshBuffer.prototype.SHRINK_TIME = 16;

/**
 * Add vertices to the buffer
 * @param {...Number} vertices Any number of vertices
 */
MeshBuffer.prototype.addVertices = function(...vertices) {
    const count = vertices.length;

    if (this.indexVertices + count > this.capacityVertices) {
        const verticesPrevious = this.vertices;

        this.capacityVertices += this.BLOCK_SIZE;
        this.vertices = new Float32Array(this.capacityVertices);
        this.vertices.set(verticesPrevious, 0);
    }

    this.vertices.set(vertices, this.indexVertices);
    this.indexVertices += count;
};

/**
 * Add indices to the buffer
 * @param {...Number} indices Any number of indices
 */
MeshBuffer.prototype.addIndices = function(...indices) {
    const count = indices.length;

    if (this.indexIndices + count > this.capacityIndices) {
        const indicesPrevious = this.indices;

        this.capacityIndices += this.BLOCK_SIZE;
        this.indices = new Uint16Array(this.capacityIndices);
        this.indices.set(indicesPrevious, 0);
    }

    this.indices.set(indices, this.indexIndices);
    this.indexIndices += count;
};

/**
 * Get the number of vertices in this buffer
 */
MeshBuffer.prototype.getVertexCount = function() {
    return this.indexVertices * this.inverseStride;
};

/**
 * Bind the vertex and index buffers of this mesh buffer
 */
MeshBuffer.prototype.bind = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferVertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);
};

/**
 * Upload all buffered vertices & indices, and clear the accumulated buffers
 */
MeshBuffer.prototype.upload = function() {
    this.uploadedIndices = this.indexIndices;

    if (this.indexIndices === 0)
        return;

    this.bind();

    if (this.capacityVertices > this.bufferVerticesCapacity) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.bufferVerticesCapacity = this.capacityVertices;
    }
    else
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.vertices);

    if (this.capacityIndices > this.bufferIndicesCapacity) {
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.bufferIndicesCapacity = this.capacityIndices;
    }
    else
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, this.indices);

    if (this.capacityVertices > this.indexVertices + this.SHRINK_THRESHOLD) {
        if (++this.verticesShrinkTime === this.SHRINK_TIME) {
            this.capacityVertices -= this.BLOCK_SIZE;
            this.vertices = new Float32Array(this.capacityVertices);
            this.verticesShrinkTime = 0;
        }
    }
    else
        this.verticesShrinkTime = 0;

    if (this.capacityIndices > this.indexIndices + this.SHRINK_THRESHOLD) {
        if (++this.indicesShrinkTime === this.SHRINK_TIME) {
            this.capacityIndices -= this.BLOCK_SIZE;
            this.indices = new Uint16Array(this.capacityIndices);
            this.indicesShrinkTime = 0;
        }
    }
    else
        this.indicesShrinkTime = 0;

    this.indexVertices = this.indexIndices = 0;
};

/**
 * Render the contents of this buffer
 */
MeshBuffer.prototype.render = function() {
    if (this.uploadedIndices !== 0)
        this.gl.drawElements(this.gl.TRIANGLES, this.uploadedIndices, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Check whether this mesh buffer has content ready to render
 * @returns {Boolean} A boolean indicating whether this mesh buffer has content
 */
MeshBuffer.prototype.hasContent = function() {
    return this.indexIndices !== 0;
};

/**
 * Free all resources maintained by the buffer
 */
MeshBuffer.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};