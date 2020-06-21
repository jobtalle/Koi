/**
 * A flexible mesh buffer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} stride The vertex stride
 * @constructor
 */
const MeshBuffer = function(gl, stride) {
    this.gl = gl;
    this.stride = 1 / stride;
    this.meshData = new MeshData();
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
    this.meshData.vertices.push(...vertices);
};

/**
 * Add indices to the buffer
 * @param {...Number} indices Any number of indices
 */
MeshBuffer.prototype.addIndices = function(...indices) {
    this.meshData.indices.push(...indices);
};

/**
 * Get the number of vertices in this buffer
 */
MeshBuffer.prototype.getVertexCount = function() {
    return this.meshData.getVertexCount() * this.stride;
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
    this.uploadMeshData(this.meshData);
    this.meshData.clear();
};

/**
 * Upload mesh data to this mesh buffer
 * @param {MeshData} meshData Mesh data to upload
 */
MeshBuffer.prototype.uploadMeshData = function(meshData) {
    if (meshData.empty())
        return;

    this.bind();

    if (meshData.getVertexCount() > this.bufferVerticesCapacity) {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(meshData.vertices), this.gl.DYNAMIC_DRAW);
        this.bufferVerticesCapacity = meshData.getVertexCount();
    }
    else
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(meshData.vertices));

    if (meshData.getIndexCount() > this.bufferIndicesCapacity) {
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshData.indices), this.gl.DYNAMIC_DRAW);
        this.bufferIndicesCapacity = meshData.getIndexCount();
    }
    else
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(meshData.indices));

    this.indexCount = meshData.getIndexCount();
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