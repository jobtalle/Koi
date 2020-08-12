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
            "random",
            "colorFilter",
            "depth",
            "height",
            "size",
            "waterSize",
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

Ponds.prototype.DEPTH = .15;
Ponds.prototype.HEIGHT = .5;
Ponds.prototype.COLOR_FILTER = Color.fromCSS("--color-water-filter");

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
uniform sampler2D shore;
uniform sampler2D random;
uniform lowp vec3 colorFilter;
uniform mediump vec2 size;
uniform mediump float depth;
uniform mediump float height;
uniform mediump vec2 waterSize;
uniform mediump float phase;
uniform mediump float time;

varying mediump vec2 iUv;

mediump float get(mediump vec2 delta) {
  mediump vec2 uv = iUv + delta / waterSize;
  lowp vec2 sample = texture2D(water, uv).gr;
  
  return mix(sample.x, sample.y, time) * 6.0 - 3.0;
}

void main() {
  mediump float dyx = get(vec2(1.0, 0.0)) - get(vec2(-1.0, 0.0));
  mediump float dyz = get(vec2(0.0, 1.0)) - get(vec2(0.0, -1.0));
  mediump vec3 normal = cross(
    normalize(vec3(2.0, dyx, 0.0)),
    normalize(vec3(0.0, dyz, 2.0)));
  mediump float shiny = dot(normalize(vec3(1.0, 0.0, 1.0)), normal) * 0.6;
  
  if (shiny < 0.0)
    shiny *= 0.3;
  
  lowp vec3 pixel = texture2D(background, iUv - depth * normal.xz / size).rgb;
  lowp vec4 reflected = texture2D(reflections, iUv + height * normal.xz / size);
  lowp float shoreDistance = reflected.a;
  
  gl_FragColor = vec4(mix(colorFilter * pixel, reflected.rgb, 0.1 + shiny), 1.0);
  
  mediump float shoreThreshold = 0.15;
  mediump float waveThreshold = (shoreDistance / shoreThreshold) * 0.5;
  mediump float phaseShift = texture2D(random, gl_FragCoord.xy * 0.0001).r * 7.0;
  
  if (cos(phase * 6.283185 - shoreDistance * 25.0 + phaseShift) * 0.5 + 0.7 + max(0.0, shiny) * 12.0 > waveThreshold)
    gl_FragColor += vec4(0.15);
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
 * @param {RandomSource} randomSource A random source
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
    randomSource,
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
    this.gl.uniform1i(this.program["uRandom"], 3);
    this.gl.uniform3f(this.program["uColorFilter"], this.COLOR_FILTER.r, this.COLOR_FILTER.g, this.COLOR_FILTER.b);
    this.gl.uniform1f(this.program["uDepth"], this.DEPTH * scale);
    this.gl.uniform1f(this.program["uHeight"], this.HEIGHT * scale);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform2f(this.program["uWaterSize"], water.width, water.height);
    this.gl.uniform1f(this.program["uPhase"], phase);
    this.gl.uniform1f(this.program["uTime"], time);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, background);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, reflections);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getFront().texture);
    this.gl.activeTexture(this.gl.TEXTURE3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, randomSource.texture);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    this.renderMesh();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
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