/**
 * A renderer for fish bodies
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Bodies = function(gl) {
    this.gl = gl;
    this.buffered = 0;
    this.maxBuffered = 0;
    this.vertices = [];
    this.indices = this.createIndices();
    this.indicesPerBody = this.indices.length;
    this.bufferVertices = gl.createBuffer();
    this.bufferIndices = gl.createBuffer();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [],
        ["position", "uv"]);
};

Bodies.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Bodies.prototype.SHADER_FRAGMENT = `#version 100
varying mediump vec2 iUv;

void main() {
  gl_FragColor = vec4(iUv, 0.0, 1.0);
}
`;

/**
 * Add a body to the batch
 * @param {Body} body A body
 */
Bodies.prototype.addToBatch = function(body) {

};

Bodies.prototype.createIndices = function() {
    const indices = [];

    // TODO: Create first set of indices

    return indices;
};

/**
 * Resize the buffers
 */
Bodies.prototype.resizeBuffers = function() {
    // TODO: append indices

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.DYNAMIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

    this.maxBuffered = this.buffered;
};

/**
 * Upload the buffered data
 */
Bodies.prototype.upload = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferVertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);

    if (this.buffered > this.maxBuffered)
        this.resizeBuffers();

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.vertices));

    this.vertices.length = 0;
};

/**
 * Draw all buffered bodies
 */
Bodies.prototype.draw = function() {
    this.upload();

    this.vertices.length = 0;
};

/**
 * Free all resources maintained by this body renderer
 */
Bodies.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
    this.program.free();
};