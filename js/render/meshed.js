/**
 * An object which is rendered with a mesh that must be assigned to it
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Meshed.VAOConfiguration[]} vaoConfigurations VAO configurations
 * @constructor
 */
const Meshed = function(gl, vaoConfigurations) {
    this.gl = gl;
    this.vaoConfigurations = vaoConfigurations;
    this.mesh = null;
    this.elementCount = -1;
    this.indexFormat = -1;
};

/**
 * A VAO configuration
 * @param {WebGLVertexArrayObjectOES} vao A VAO to configure
 * @param {Function} attribs A function to execute whenever the mesh changes that configures the attributes of the VAO
 * @constructor
 */
Meshed.VAOConfiguration = function(vao, attribs) {
    this.vao = vao;
    this.attribs = attribs;
};

/**
 * Configure this VAO configuration
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Mesh} mesh The mesh
 */
Meshed.VAOConfiguration.prototype.configure = function(gl, mesh) {
    gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.attribs();
};

/**
 * Set the mesh for this object
 * @param {Mesh} mesh A mesh
 */
Meshed.prototype.setMesh = function(mesh) {
    this.elementCount = mesh.elementCount;
    this.indexFormat = mesh.indexFormat;

    for (const configuration of this.vaoConfigurations)
        configuration.configure(this.gl, mesh);
};

/**
 * Render the mesh
 */
Meshed.prototype.renderMesh = function() {
    this.gl.drawElements(this.gl.TRIANGLES, this.elementCount, this.indexFormat, 0);
};