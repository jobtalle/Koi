/**
 * A wave simulation shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Waves = function(gl) {
    this.gl = gl;
    this.programPropagate = new Shader(
        gl,
        this.SHADER_PROPAGATE_VERTEX,
        this.SHADER_PROPAGATE_FRAGMENT,
        ["size", "scale", "damping"],
        ["position"]);
    this.vaoPropagate = gl.vao.createVertexArrayOES();
    this.programDistort = new Shader(
        gl,
        this.SHADER_DISTORT_VERTEX,
        this.SHADER_DISTORT_FRAGMENT,
        ["scale", "background", "reflections", "waterBack", "waterFront", "depth", "height", "size", "waterSize", "time"],
        ["position", "depth"]);
    this.vaoDistort = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Waves.prototype.DAMPING = .994;
Waves.prototype.DEPTH = .1;
Waves.prototype.HEIGHT = .6;

Waves.prototype.SHADER_DISTORT_VERTEX = `#version 100
uniform mediump float scale;
uniform mediump vec2 size;

attribute vec2 position;

void main() {
  gl_Position = vec4(vec2(2.0, -2.0) * position / size * scale + vec2(-1.0, 1.0), 0.999999, 1.0);
}
`;

Waves.prototype.SHADER_DISTORT_FRAGMENT = `#version 100
uniform sampler2D background;
uniform sampler2D reflections;
uniform sampler2D waterBack;
uniform sampler2D waterFront;
uniform mediump float depth;
uniform mediump float height;
uniform mediump vec2 size;
uniform mediump vec2 waterSize;
uniform mediump float time;

mediump float get(mediump vec2 delta) {
  mediump vec2 uv = gl_FragCoord.xy / size + delta / waterSize;
  
  return mix(texture2D(waterBack, uv).r, texture2D(waterFront, uv).r, time) * 6.0 - 3.0;
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
    if (shiny > 0.5) // TODO: Specular hack
      shiny *= 1.3;
  }
  
  shiny *= 0.4;
  
  mediump vec4 filter = vec4(0.93, 0.98, 1.0, 1.0) * vec4(0.92, 0.97, 1.0, 1.0);
  
  lowp vec4 pixel = texture2D(background, gl_FragCoord.xy / size - depth * normal.xz / size);
  lowp vec4 reflected = texture2D(reflections, gl_FragCoord.xy / size + height * normal.xz / size);
  
  gl_FragColor = mix(
    filter * mix(pixel, reflected, 0.16),
    reflected,
    shiny);
}
`;

Waves.prototype.SHADER_PROPAGATE_VERTEX = `#version 100
uniform mediump vec2 size;
uniform mediump float scale;

attribute vec2 position;

void main() {
  gl_Position = vec4(vec2(2.0, -2.0) * position / size * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Waves.prototype.SHADER_PROPAGATE_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;
uniform mediump float damping;

void main() {
  mediump vec2 uv = gl_FragCoord.xy / size;
  mediump vec2 step = vec2(1.0 / size.x, 1.0 / size.y);
  mediump vec3 state = texture2D(source, uv).rgb;
  mediump float hLeft = texture2D(source, vec2(uv.x - step.x, uv.y)).r;
  mediump float hRight = texture2D(source, vec2(uv.x + step.x, uv.y)).r;
  mediump float hUp = texture2D(source, vec2(uv.x, uv.y - step.y)).r;
  mediump float hDown = texture2D(source, vec2(uv.x, uv.y + step.y)).r;
  mediump float momentum = (state.g + state.b) * 2.0 - 1.0;
  mediump float newHeight = (hLeft + hUp + hRight + hDown) - 2.0;
  
  gl_FragColor = vec4(
    ((newHeight - momentum) * damping) * 0.5 + 0.5,
    state.r,
    0.0,
    0.0);
}
`;

/**
 * Set the mesh
 * @param {Mesh} mesh The mesh
 */
Waves.prototype.setMesh = function(mesh) {
    this.indexCount = mesh.indexCount;

    this.gl.vao.bindVertexArrayOES(this.vaoPropagate);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.programPropagate.aPosition);
    this.gl.vertexAttribPointer(this.programPropagate.aPosition, 2, this.gl.FLOAT, false, 8, 0);

    this.gl.vao.bindVertexArrayOES(this.vaoDistort);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.programDistort.aPosition);
    this.gl.vertexAttribPointer(this.programDistort.aPosition, 2, this.gl.FLOAT, false, 8, 0);
};

/**
 * Propagate the waves on a water plane
 * @param {WaterPlane} water A water plane
 * @param {WavePainter} wavePainter A wave painter to render wave influences
 */
Waves.prototype.propagate = function(water, wavePainter) {
    this.programPropagate.use();
    this.gl.vao.bindVertexArrayOES(this.vaoPropagate);

    water.flip();
    water.getFront().target();

    this.gl.clearColor(0.5, 0.5, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.uniform2f(this.programPropagate.uSize, water.width, water.height);
    this.gl.uniform1f(this.programPropagate.uScale, water.SCALE);
    this.gl.uniform1f(this.programPropagate.uDamping, this.DAMPING);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getBack().texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    wavePainter.applyInfluences(water);
};

/**
 * Render waves
 * @param {WebGLTexture} background A background texture
 * @param {WebGLTexture} reflections A texture containing the reflections
 * @param {WaterPlane} water A water plane to shade the background with
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 * @param {Number} time The interpolation factor
 */
Waves.prototype.render = function(
    background,
    reflections,
    water,
    width,
    height,
    scale,
    time) {
    this.programDistort.use();
    this.gl.vao.bindVertexArrayOES(this.vaoDistort);

    this.gl.uniform1f(this.programDistort.uScale, scale);
    this.gl.uniform1i(this.programDistort.uBackground, 0);
    this.gl.uniform1i(this.programDistort.uReflections, 1);
    this.gl.uniform1i(this.programDistort.uWaterBack, 2);
    this.gl.uniform1i(this.programDistort.uWaterFront, 3);
    this.gl.uniform1f(this.programDistort.uDepth, this.DEPTH * scale);
    this.gl.uniform1f(this.programDistort.uHeight, this.HEIGHT * scale);
    this.gl.uniform2f(this.programDistort.uSize, width, height);
    this.gl.uniform2f(this.programDistort.uWaterSize, water.width, water.height);
    this.gl.uniform1f(this.programDistort.uTime, time);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, background);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, reflections);
    this.gl.activeTexture(this.gl.TEXTURE2);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getBack().texture);
    this.gl.activeTexture(this.gl.TEXTURE3);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getFront().texture);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by this object
 */
Waves.prototype.free = function() {
    this.programDistort.free();
    this.programPropagate.free();
    this.gl.vao.deleteVertexArrayOES(this.vaoPropagate);
    this.gl.vao.deleteVertexArrayOES(this.vaoDistort);
};