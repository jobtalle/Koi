/**
 * An influence painter to paint on data textures
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const InfluencePainter = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size"],
        ["vertex", "color"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.buffer = new MeshBuffer(gl, 5);

    gl.vao.bindVertexArrayOES(this.vao);

    this.buffer.bind();

    gl.enableVertexAttribArray(this.program["aVertex"]);
    gl.vertexAttribPointer(this.program["aVertex"],2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(this.program["aColor"]);
    gl.vertexAttribPointer(this.program["aColor"], 3, gl.FLOAT, false, 20, 8);
};

/**
 * A set of influences on an influence painter
 * @param {Number} width The target width
 * @param {Number} height The target height
 * @param {Number} scale The scale of these influences
 * @constructor
 */
InfluencePainter.Influences = function(width, height, scale) {
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.hasInfluences = false;
    this.meshData = new MeshData();
};

/**
 * Add a flare influence to a set of influences
 * @param {Number} x The flare X position
 * @param {Number} y The flare Y position
 * @param {Number} radius The flare radius
 * @param {Number} r The red influence in the range [0, 1]
 * @param {Number} g The green influence in the range [0, 1]
 * @param {Number} b The blue influence in the range [0, 1]
 */
InfluencePainter.Influences.prototype.addFlare = function(
    x,
    y,
    radius,
    r,
    g,
    b) {
    const offset = this.meshData.vertices.length * .2;

    for (let vertex = 0, vertices = this.FLARE.vertices.length; vertex < vertices; vertex += 5)
        this.meshData.vertices.push(
            (this.FLARE.vertices[vertex] * radius + x) * this.scale,
            (this.FLARE.vertices[vertex + 1] * radius + y) * this.scale,
            this.FLARE.vertices[vertex + 2] * r,
            this.FLARE.vertices[vertex + 3] * g,
            this.FLARE.vertices[vertex + 4] * b);

    for (const index of this.FLARE.indices)
        this.meshData.indices.push(
            index + offset);

    this.hasInfluences = true;
};

InfluencePainter.Influences.prototype.FLARE_PRECISION = 12;
InfluencePainter.Influences.prototype.FLARE = (() => {
    const vertices = [0, 0, 1, 1, 1];
    const indices = [];

    for (let i = 0; i <= InfluencePainter.Influences.prototype.FLARE_PRECISION; ++i) {
        const r = Math.PI * 2 * i / InfluencePainter.Influences.prototype.FLARE_PRECISION;

        vertices.push(
            Math.cos(r),
            Math.sin(r),
            0,
            0,
            0);

        indices.push(
            0,
            i + 1,
            ((i + 1) % InfluencePainter.Influences.prototype.FLARE_PRECISION) + 1);
    }

    return new MeshData(vertices, indices);
})();

/**
 * Clear the influences
 */
InfluencePainter.Influences.prototype.clear = function() {
    this.meshData.clear();
    this.hasInfluences = false;
};

InfluencePainter.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;

attribute vec2 vertex;
attribute vec3 color;

varying vec3 iColor;

void main() {
  iColor = color;
  
  gl_Position = vec4(vec2(2.0, -2.0) * vertex.xy / size + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

InfluencePainter.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 0.0);
}
`;

/**
 * Apply the influences written to a water plane
 * @param {InfluencePainter.Influences} influences A set of influences
 */
InfluencePainter.prototype.applyInfluences = function(influences) {
    if (influences.hasInfluences) {
        this.program.use();

        this.gl.vao.bindVertexArrayOES(this.vao);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

        this.gl.uniform2f(this.program["uSize"], influences.width, influences.height);

        this.buffer.uploadMeshData(influences.meshData);
        this.buffer.render();

        this.gl.disable(this.gl.BLEND);
    }
};

/**
 * Free all resources maintained by this wave painter
 */
InfluencePainter.prototype.free = function() {
    this.buffer.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};