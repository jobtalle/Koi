/**
 * The ponds renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Ponds = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [
            "background",
            "reflections",
            "water",
            "colorFilter",
            "colorHighlight",
            "depth",
            "height",
            "size",
            "waterSize",
            "wavePhase",
            "phase",
            "time"],
        ["position"]);
    this.programShape = new Shader(
        gl,
        this.SHADER_VERTEX_SHAPE,
        this.SHADER_FRAGMENT_SHAPE,
        ["color"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.vaoShape = gl.vao.createVertexArrayOES();

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vao,
            () => {
                gl.enableVertexAttribArray(this.program["aPosition"]);
                gl.vertexAttribPointer(this.program["aPosition"],
                    2, gl.FLOAT, false, 8, 0);
            }
        ),
        new Meshed.VAOConfiguration(
            this.vaoShape,
            () => {
                gl.enableVertexAttribArray(this.programShape["aPosition"]);
                gl.vertexAttribPointer(this.programShape["aPosition"],
                    2, gl.FLOAT, false, 8, 0);
            }
        )
    ]);
};

Ponds.prototype = Object.create(Meshed.prototype);

Ponds.prototype.DEPTH = .17;
Ponds.prototype.HEIGHT = .55;
Ponds.prototype.WAVE_PHASE = 1.65;
Ponds.prototype.COLOR_FILTER = Color.fromCSS("--color-water-filter");
Ponds.prototype.COLOR_HIGHLIGHT = Color.fromCSS("--color-water-highlight");

Ponds.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = 0.5 * position + 0.5;

  gl_Position = vec4(position, 0.999999, 1.0);
}
`;

Ponds.prototype.SHADER_VERTEX_SHAPE = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Ponds.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D background;
uniform sampler2D reflections;
uniform sampler2D water;
uniform lowp vec3 colorFilter;
uniform lowp vec3 colorHighlight;
uniform mediump vec2 size;
uniform mediump vec2 wavePhase;
uniform mediump float depth;
uniform mediump float height;
uniform mediump vec2 waterSize;
uniform mediump float phase;
uniform mediump float time;
varying mediump vec2 iUv;

lowp float get(mediump vec2 delta) {
  mediump vec2 uv = iUv + delta / waterSize;
  lowp vec2 sample = texture2D(water, uv).gr;
  
  return (mix(sample.x, sample.y, time) - 0.5) * 4.0;
}

void main() {
  mediump float dyx = get(vec2(1.3, 0.0)) - get(vec2(-1.3, 0.0));
  mediump float dyz = get(vec2(0.0, 1.3)) - get(vec2(0.0, -1.3));
  mediump vec3 normal = cross(
    normalize(vec3(2.5, dyx, 0.0)),
    normalize(vec3(0.0, dyz, 2.5)));
  
  lowp vec3 pixel = texture2D(background, iUv - depth * normal.xz / size).rgb;
  lowp vec4 reflected = texture2D(reflections, iUv + height * normal.xz / size);
  lowp float shoreDistance = reflected.a;
  
  mediump float phaseShift = 4.3 * (0.5 + 0.5 * sin((iUv.x * wavePhase.x) * 6.283185) * sin(iUv.y * wavePhase.y * 6.283185)) + normal.y * 16.0;
  mediump float wave = max(cos(phase * 6.283185 - shoreDistance * 7.0 + phaseShift) * 0.35 + 0.6, 0.3 + (normal.x + normal.z) * 3.9);
  mediump float overhead = wave - shoreDistance;
  mediump float transition = 0.3;
  mediump float maxBlend = 0.25;
  mediump float reflectivity = 0.14;
  mediump float shininess = 0.44;
  
  gl_FragColor.rgb = mix(
    mix(colorFilter * pixel, reflected.rgb, reflectivity + max(0.0, (normal.x + normal.z) * shininess)),
    colorHighlight,
    max(0.0, min(maxBlend, overhead / transition)));
}
`;

Ponds.prototype.SHADER_FRAGMENT_SHAPE = `#version 100
uniform lowp vec4 color;

void main() {
  gl_FragColor = color;
}
`;

/**
 * Render ponds
 * @param {WebGLTexture} background A background texture
 * @param {WebGLTexture} reflections A texture containing the reflections
 * @param {Water} water A water plane to shade the background with
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 * @param {Number} phase The animation phase
 * @param {Number} time The interpolation factor
 */
Ponds.prototype.render = function(
    background,
    reflections,
    water,
    width,
    height,
    scale,
    phase,
    time) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform1i(this.program["uBackground"], 0);
    this.gl.uniform1i(this.program["uReflections"], 1);
    this.gl.uniform1i(this.program["uWater"], 2);
    this.gl.uniform3f(this.program["uColorFilter"],
        this.COLOR_FILTER.r,
        this.COLOR_FILTER.g,
        this.COLOR_FILTER.b);
    this.gl.uniform3f(this.program["uColorHighlight"],
        this.COLOR_HIGHLIGHT.r,
        this.COLOR_HIGHLIGHT.g,
        this.COLOR_HIGHLIGHT.b);
    this.gl.uniform1f(this.program["uDepth"], this.DEPTH * scale);
    this.gl.uniform1f(this.program["uHeight"], this.HEIGHT * scale);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform2f(this.program["uWavePhase"],
        width / scale / this.WAVE_PHASE,
        height / scale / this.WAVE_PHASE);
    this.gl.uniform2f(this.program["uWaterSize"], water.width, water.height);
    this.gl.uniform1f(this.program["uPhase"], phase);
    this.gl.uniform1f(this.program["uTime"], time);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, background);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, reflections);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getFront().texture);

    this.renderMesh();
};

/**
 * Render the shape of the ponds as polygons
 * @param {Color} color The polygon color
 */
Ponds.prototype.renderShape = function(color) {
    this.programShape.use();
    this.gl.vao.bindVertexArrayOES(this.vaoShape);

    this.gl.uniform4f(this.programShape["uColor"], color.r, color.g, color.b, color.a);

    this.renderMesh();
};

/**
 * Free all resources maintained by the ponds renderer
 */
Ponds.prototype.free = function() {
    this.program.free();
    this.programShape.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.gl.vao.deleteVertexArrayOES(this.vaoShape);
};