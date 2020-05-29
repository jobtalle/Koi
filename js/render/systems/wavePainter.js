/**
 * A wave painter
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const WavePainter = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "origin", "radius", "displacement"],
        ["vertex"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    this.bufferFlare = this.createBufferFlare();

    gl.enableVertexAttribArray(this.program.aVertex);
    gl.vertexAttribPointer(this.program.aVertex,3, gl.FLOAT, false, 12, 0);
};

WavePainter.prototype.SHAPE_FLARE_PRECISION = 16;

WavePainter.prototype.SHADER_VERTEX = `#version 100
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

WavePainter.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump float displacement;

varying mediump float alpha;

void main() {
  gl_FragColor = vec4(0.0, 0.0, alpha * displacement, 0.0);
}
`;

/**
 * Create a buffer containing a flare shapeBody
 */
WavePainter.prototype.createBufferFlare = function() {
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
 */
WavePainter.prototype.paintFlares = function(flares) {
    const flareCount = flares.length >> 2;

    this.gl.vao.bindVertexArrayOES(this.vao);

    for (let flare = 0; flare < flareCount; ++flare) {
        const index = flare + flare + flare + flare;

        this.gl.uniform2f(this.program.uOrigin,
            flares[index] * Water.prototype.SCALE,
            flares[index + 1] * Water.prototype.SCALE);
        this.gl.uniform1f(this.program.uRadius,
            flares[index + 2] * Water.prototype.SCALE);
        this.gl.uniform1f(this.program.uDisplacement,
            flares[index + 3]);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.SHAPE_FLARE_PRECISION + 2);
    }

    flares.length = 0;
};

/**
 * Apply the influences written to a water plane
 * @param {Water} water A water plane
 */
WavePainter.prototype.applyInfluences = function(water) {
    if (water.hasInfluences) {
        this.program.use();
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

        this.gl.uniform2f(this.program.uSize, water.width, water.height);

        if (water.flares.length !== 0)
            this.paintFlares(water.flares);

        this.gl.disable(this.gl.BLEND);

        water.hasInfluences = false;
    }
};

/**
 * Free all resources maintained by this wave painter
 */
WavePainter.prototype.free = function() {
    this.gl.deleteBuffer(this.bufferFlare);
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};