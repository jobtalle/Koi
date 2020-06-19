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
        ["size", "origin", "radius", "color"],
        ["vertex"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.buffer = new MeshBuffer(gl, 3);

    gl.vao.bindVertexArrayOES(this.vao);

    this.bufferFlare = this.createBufferFlare();

    gl.enableVertexAttribArray(this.program["aVertex"]);
    gl.vertexAttribPointer(this.program["aVertex"],3, gl.FLOAT, false, 12, 0);
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
    this.flares = [];
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
    this.hasInfluences = true;
    this.flares.push(x, y, radius, r, g, b);
};

InfluencePainter.prototype.SHAPE_FLARE_PRECISION = 16;

InfluencePainter.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform vec2 origin;
uniform float radius;

attribute vec3 vertex;

varying mediump float alpha;

void main() {
  alpha = vertex.z;
  
  gl_Position = vec4(vec2(2.0, -2.0) * (vertex.xy * radius + origin) / size + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

InfluencePainter.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 color;

varying mediump float alpha;

void main() {
  gl_FragColor = vec4(color * alpha, 0.0);
}
`;

/**
 * Create a buffer containing a flare shapeBody
 */
InfluencePainter.prototype.createBufferFlare = function() {
    const buffer = this.gl.createBuffer();
    const vertices = [0, 0, 1];

    for (let i = 0; i <= this.SHAPE_FLARE_PRECISION; ++i) {
        const r = Math.PI * 2 * i / this.SHAPE_FLARE_PRECISION;

        vertices.push(
            Math.cos(r),
            Math.sin(r),
            0);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    return buffer;
};

/**
 * Process a flare buffer
 * @param {Number[]} flares An array containing flare data
 * @param {Number} scale The scale
 */
InfluencePainter.prototype.paintFlares = function(flares, scale) {
    const flareCount = flares.length / 6;

    this.gl.vao.bindVertexArrayOES(this.vao);

    for (let flare = 0; flare < flareCount; ++flare) {
        const index = flare * 6;

        this.gl.uniform2f(this.program["uOrigin"],
            flares[index] * scale,
            flares[index + 1] * scale);
        this.gl.uniform1f(this.program["uRadius"],
            flares[index + 2] * scale);
        this.gl.uniform3f(this.program["uColor"],
            flares[index + 3],
            flares[index + 4],
            flares[index + 5]);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.SHAPE_FLARE_PRECISION + 2);
    }

    flares.length = 0;
};

/**
 * Apply the influences written to a water plane
 * @param {InfluencePainter.Influences} influences A set of influences
 */
InfluencePainter.prototype.applyInfluences = function(influences) {
    if (influences.hasInfluences) {
        this.program.use();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

        this.gl.uniform2f(this.program["uSize"], influences.width, influences.height);

        if (influences.flares.length !== 0)
            this.paintFlares(influences.flares, influences.scale);

        this.gl.disable(this.gl.BLEND);

        influences.hasInfluences = false;
    }
};

/**
 * Free all resources maintained by this wave painter
 */
InfluencePainter.prototype.free = function() {
    this.buffer.free();
    this.gl.deleteBuffer(this.bufferFlare);
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};