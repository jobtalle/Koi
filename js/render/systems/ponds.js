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
        ["background", "reflections", "water", "shore", "random", "depth", "height", "size", "waterSize", "phase", "time"],
        ["position"]);
    this.programShape = new Shader(
        gl,
        this.SHADER_VERTEX_SHAPE,
        this.SHADER_FRAGMENT_SHAPE,
        [],
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

Ponds.prototype.DEPTH = .1;
Ponds.prototype.HEIGHT = .5;

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
  
  mediump vec4 filter = vec4(0.93, 0.98, 1.0, 1.0) * vec4(0.92, 0.97, 1.0, 1.0);
  
  lowp vec4 pixel = texture2D(background, iUv - depth * normal.xz / size);
  lowp vec4 reflected = texture2D(reflections, iUv + height * normal.xz / size);
  lowp float shoreDistance = texture2D(shore, iUv).r;
  
  gl_FragColor = filter * mix(pixel, reflected, 0.1 + shiny);
  
  mediump float shoreThreshold = 0.15;
  mediump float waveThreshold = (shoreDistance / shoreThreshold) * 0.5;
  mediump float phaseShift = texture2D(random, gl_FragCoord.xy * 0.0001).r * 7.0;
  
  if (cos(phase * 6.283185 - shoreDistance * 25.0 + phaseShift) * 0.5 + 0.7 + max(0.0, shiny) * 12.0 > waveThreshold)
    gl_FragColor += vec4(0.15);
}
`;

Ponds.prototype.SHADER_FRAGMENT_SHAPE = `#version 100
void main() {
  gl_FragColor = vec4(1.0);
}
`;

/**
 * Render ponds
 * @param {WebGLTexture} background A background texture
 * @param {WebGLTexture} reflections A texture containing the reflections
 * @param {WebGLTexture} shore A texture containing shore distance
 * @param {WebGLTexture} random A random source texture
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
    shore,
    random,
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
    this.gl.uniform1i(this.program["uShore"], 3);
    this.gl.uniform1i(this.program["uRandom"], 4);
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
    this.gl.bindTexture(this.gl.TEXTURE_2D, shore);
    this.gl.activeTexture(this.gl.TEXTURE4);
    this.gl.bindTexture(this.gl.TEXTURE_2D, random);

    this.renderMesh();
};

/**
 * Render the shape of the ponds as white polygons
 */
Ponds.prototype.renderShape = function() {
    this.programShape.use();
    this.gl.vao.bindVertexArrayOES(this.vaoShape);

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