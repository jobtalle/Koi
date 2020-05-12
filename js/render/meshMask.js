/**
 * An untextured mask mesh
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number[]} vertices An array of vertices
 * @param {Number[]} indices An array of indices
 * @constructor
 */
const MeshMask = function(gl, vertices, indices) {
    this.gl = gl;
    this.vertices = gl.createBuffer();
    this.indices = gl.createBuffer();
    this.indexCount = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
};

/**
 * Free all resources maintained by this mesh
 */
MeshMask.prototype.free = function() {
    this.gl.deleteBuffer(this.vertices);
    this.gl.deleteBuffer(this.indices);
};
