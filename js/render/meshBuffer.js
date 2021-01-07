/**
 * A flexible mesh buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} stride The vertex stride
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

    this.arrayVerticesCapacity = this.BLOCK_SIZE;
    this.arrayIndicesCapacity = this.BLOCK_SIZE;
    this.arrayVerticesIndex = 0;
    this.arrayIndicesIndex = 0;
    this.arrayVerticesShrinkTime = 0;
    this.arrayIndicesShrinkTime = 0;

    this.arrayVertices = new Float32Array(this.arrayVerticesCapacity);
    this.arrayIndices = new Uint16Array(this.arrayIndicesCapacity);
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

    if (this.arrayVerticesIndex + count > this.arrayVerticesCapacity) {
        const verticesPrevious = this.arrayVertices;

        this.arrayVerticesCapacity += this.BLOCK_SIZE;
        this.arrayVertices = new Float32Array(this.arrayVerticesCapacity);
        this.arrayVertices.set(verticesPrevious, 0);
    }

    this.arrayVertices.set(vertices, this.arrayVerticesIndex);
    this.arrayVerticesIndex += count;
};

/**
 * Add indices to the buffer
 * @param {...Number} indices Any number of indices
 */
MeshBuffer.prototype.addIndices = function(...indices) {
    const count = indices.length;

    if (this.arrayIndicesIndex + count > this.arrayIndicesCapacity) {
        const indicesPrevious = this.arrayIndices;

        this.arrayIndicesCapacity += this.BLOCK_SIZE;
        this.arrayIndices = new Uint16Array(this.arrayIndicesCapacity);
        this.arrayIndices.set(indicesPrevious, 0);
    }

    this.arrayIndices.set(indices, this.arrayIndicesIndex);
    this.arrayIndicesIndex += count;
};

/**
 * Get the number of vertices in this buffer
 */
MeshBuffer.prototype.getVertexCount = function() {
    return this.arrayVerticesIndex * this.inverseStride;
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
    this.uploadedIndices = this.arrayIndicesIndex;

    if (this.arrayIndicesIndex === 0)
        return;

    this.bind();

    if (this.arrayVerticesCapacity > this.bufferVerticesCapacity) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.arrayVertices, this.gl.DYNAMIC_DRAW);
        this.bufferVerticesCapacity = this.arrayVerticesCapacity;
    }
    else
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.arrayVertices);

    if (this.arrayIndicesCapacity > this.bufferIndicesCapacity) {
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.arrayIndices, this.gl.DYNAMIC_DRAW);
        this.bufferIndicesCapacity = this.arrayIndicesCapacity;
    }
    else
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, this.arrayIndices);

    if (this.arrayVerticesCapacity > this.arrayVerticesIndex + this.SHRINK_THRESHOLD) {
        if (++this.arrayVerticesShrinkTime === this.SHRINK_TIME) {
            this.arrayVerticesCapacity -= this.BLOCK_SIZE;
            this.arrayVertices = new Float32Array(this.arrayVerticesCapacity);
            this.arrayVerticesShrinkTime = 0;
        }
    }
    else
        this.arrayVerticesShrinkTime = 0;

    if (this.arrayIndicesCapacity > this.arrayIndicesIndex + this.SHRINK_THRESHOLD) {
        if (++this.arrayIndicesShrinkTime === this.SHRINK_TIME) {
            this.arrayIndicesCapacity -= this.BLOCK_SIZE;
            this.arrayIndices = new Uint16Array(this.arrayIndicesCapacity);
            this.arrayIndicesShrinkTime = 0;
        }
    }
    else
        this.arrayIndicesShrinkTime = 0;

    this.arrayVerticesIndex = this.arrayIndicesIndex = 0;
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
    return this.arrayIndicesIndex !== 0;
};

/**
 * Free all resources maintained by the buffer
 */
MeshBuffer.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};