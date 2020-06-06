/**
 * The ponds renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Ponds = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_DISTORT_VERTEX,
        this.SHADER_DISTORT_FRAGMENT,
        ["background", "reflections", "water", "depth", "height", "size", "waterSize", "time"],
        ["position", "depth"]);
    this.vao = gl.vao.createVertexArrayOES();

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vao,
            () => {
                gl.enableVertexAttribArray(this.program["aPosition"]);
                gl.vertexAttribPointer(this.program["aPosition"],
                    2, gl.FLOAT, false, 8, 0);
            }
        )
    ]);
};

Ponds.prototype = Object.create(Meshed.prototype);

Ponds.prototype.DEPTH = .1;
Ponds.prototype.HEIGHT = .5;

Ponds.prototype.SHADER_DISTORT_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = 0.5 * position + 0.5;

  gl_Position = vec4(position, 0.999999, 1.0);
}
`;

Ponds.prototype.SHADER_DISTORT_FRAGMENT = `#version 100
uniform sampler2D background;
uniform sampler2D reflections;
uniform sampler2D water;
uniform mediump vec2 size;
uniform mediump float depth;
uniform mediump float height;
uniform mediump vec2 waterSize;
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
  mediump float shiny = dot(normalize(vec3(1.0, 0.0, 1.0)), normal);
  
  if (shiny < 0.0)
    shiny *= 0.2;
  else {
    if (shiny > 0.5)
      shiny *= 1.3;
  }
  
  shiny *= 0.4;
  
  mediump vec4 filter = vec4(0.93, 0.98, 1.0, 1.0) * vec4(0.92, 0.97, 1.0, 1.0);
  
  lowp vec4 pixel = texture2D(background, iUv - depth * normal.xz / size);
  lowp vec4 reflected = texture2D(reflections, iUv + height * normal.xz / size);
  
  gl_FragColor = mix(
    filter * mix(pixel, reflected, 0.16),
    reflected,
    shiny);
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
 * @param {Number} time The interpolation factor
 */
Ponds.prototype.render = function(
    background,
    reflections,
    water,
    width,
    height,
    scale,
    time) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform1i(this.program["uBackground"], 0);
    this.gl.uniform1i(this.program["uReflections"], 1);
    this.gl.uniform1i(this.program["uWater"], 2);
    this.gl.uniform1f(this.program["uDepth"], this.DEPTH * scale);
    this.gl.uniform1f(this.program["uHeight"], this.HEIGHT * scale);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform2f(this.program["uWaterSize"], water.width, water.height);
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
 * Free all resources maintained by the ponds renderer
 */
Ponds.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};