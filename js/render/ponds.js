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
        ["position"],
        ["depth", "height", "size", "waterSize", "wavePhase", "phase", "time", "filter"],
        [
            new Shader.Constant("background", "i", [0]),
            new Shader.Constant("reflections", "i", [1]),
            new Shader.Constant("water", "i", [2]),
            new Shader.Constant("colorFilter", "f", this.COLOR_FILTER.toArrayRGB()),
            new Shader.Constant("colorHighlight", "f", this.COLOR_HIGHLIGHT.toArrayRGB())
        ]);
    this.programShape = new Shader(
        gl,
        this.SHADER_VERTEX_SHAPE,
        this.SHADER_FRAGMENT_SHAPE,
        ["position"],
        ["color"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.vaoShape = gl.vao.createVertexArrayOES();
    this.filter = Color.WHITE;

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

Ponds.prototype.DEPTH = .2;
Ponds.prototype.HEIGHT = .24;
Ponds.prototype.WAVE_PHASE = 2.4;
Ponds.prototype.COLOR_FILTER = Color.fromCSS("--color-water-filter");
Ponds.prototype.COLOR_HIGHLIGHT = Color.fromCSS("--color-water-highlight");

Ponds.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = 0.5 * position + 0.5;

  gl_Position = vec4(position, iUv.y, 1.0);
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
uniform sampler2D random;
uniform lowp vec3 colorFilter;
uniform lowp vec3 colorHighlight;
uniform lowp vec2 size;
uniform lowp vec2 wavePhase;
uniform lowp float depth;
uniform lowp float height;
uniform lowp vec2 waterSize;
uniform lowp float phase;
uniform lowp float time;
uniform lowp vec3 filter;

varying lowp vec2 iUv;

#define GLARE_BLEND 0.3
#define GLARE_TRANSITION 0.1
#define REFLECTIVITY 0.15
#define SHININESS 0.42
#define SHORE_WAVE_FREQUENCY 6.0
#define SHORE_WAVE_SHIFT 6.0
#define SHORE_WAVE_AMPLITUDE 0.38
#define SHORE_WAVE_BASE 0.58
#define WAVE_AMPLITUDE 2.0
#define WAVE_BASE 0.3
#define WATER_HEIGHT 3.7

lowp float get(highp vec2 delta) {
  lowp vec2 uv = iUv + delta / waterSize;
  lowp vec2 sample = texture2D(water, uv).gr;
  
  return (mix(sample.x, sample.y, time) - 0.5) * WATER_HEIGHT;
}

void main() {
  lowp float dyx = get(vec2(1.0, 0.0)) - get(vec2(-1.0, 0.0));
  lowp float dyz = get(vec2(0.0, 1.0)) - get(vec2(0.0, -1.0));
  lowp vec3 normal = cross(
    normalize(vec3(2.0, dyx, 0.0)),
    normalize(vec3(0.0, dyz, 2.0)));
  
  lowp vec3 pixel = texture2D(background, iUv - depth * normal.xz / size).rgb;
  lowp vec4 reflected = texture2D(reflections, iUv + height * normal.xz / size);
  lowp float shoreDistance = reflected.a;
  
  lowp float shift = sin(iUv.x * wavePhase.x * 6.283185) * sin(iUv.y * wavePhase.y * 6.283185) *
    sin(6.283185 * phase + iUv.x * wavePhase.x * 3.141592 - iUv.y * wavePhase.y * 1.256637);
  lowp float wave = max(
    cos(shift * SHORE_WAVE_SHIFT + phase * 25.132741 - shoreDistance * SHORE_WAVE_FREQUENCY) * SHORE_WAVE_AMPLITUDE + SHORE_WAVE_BASE,
    (normal.x + normal.z) * WAVE_AMPLITUDE + WAVE_BASE);
  lowp float overhead = wave - shoreDistance;
  
  gl_FragColor = vec4(vec3(mix(
    mix(colorFilter * pixel, reflected.rgb, REFLECTIVITY + max(0.0, (normal.x + normal.z) * SHININESS)),
    colorHighlight,
    max(0.0, min(GLARE_BLEND, overhead / GLARE_TRANSITION)))) * filter, 1.0);
}
`;

Ponds.prototype.SHADER_FRAGMENT_SHAPE = `#version 100
uniform lowp vec4 color;

void main() {
  gl_FragColor = color;
}
`;

/**
 * Set the filtering color
 * @param {Color} filter The filtering color
 */
Ponds.prototype.setFilter = function(filter) {
    this.filter = filter;
};

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

    this.gl.uniform1f(this.program["uDepth"], this.DEPTH * scale);
    this.gl.uniform1f(this.program["uHeight"], this.HEIGHT * scale);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform2f(this.program["uWavePhase"],
        width / (scale * this.WAVE_PHASE),
        height / (scale * this.WAVE_PHASE));
    this.gl.uniform2f(this.program["uWaterSize"], water.width, water.height);
    this.gl.uniform1f(this.program["uPhase"], phase);
    this.gl.uniform1f(this.program["uTime"], time);

    if (this.filter !== null) {
        this.gl.uniform3f(this.program["uFilter"], this.filter.r, this.filter.g, this.filter.b);

        this.filter = null;
    }

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