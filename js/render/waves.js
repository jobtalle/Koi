/**
 * A wave simulation shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Waves = function(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.programDistort = new Shader(
        gl,
        this.SHADER_DISTORT_VERTEX,
        this.SHADER_DISTORT_FRAGMENT,
        ["background", "displacement", "size"],
        ["position"]);
    this.programPropagate = new Shader(
        gl,
        this.SHADER_PROPAGATE_VERTEX,
        this.SHADER_PROPAGATE_FRAGMENT,
        ["size"],
        ["position"]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW);
};

Waves.prototype.SHADER_DISTORT_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Waves.prototype.SHADER_DISTORT_FRAGMENT = `#version 100
uniform sampler2D background;
uniform sampler2D displacement;
uniform mediump vec2 size;

lowp float get(int x, int y) {
  return texture2D(displacement, (gl_FragCoord.xy + vec2(float(x), float(y))) / size).r;
}

void main() {
  lowp float dx = get(1, 0) - get(-1, 0);
  lowp float dy = get(0, 1) - get(0, -1);
  lowp vec2 displacement = vec2(dx, dy);
  lowp vec2 focus = vec2(-0.1, 0.1);
  lowp float shiny = max(0.0, displacement.y - displacement.x);
  
  gl_FragColor = texture2D(background, gl_FragCoord.xy / size + displacement) * (1.0 + shiny);
  // gl_FragColor = vec4(texture2D(displacement, gl_FragCoord.xy / size).rg, 0.0, 1.0);
}
`;

Waves.prototype.SHADER_PROPAGATE_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Waves.prototype.SHADER_PROPAGATE_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;

void main() {
  lowp float damping = 0.998;
  lowp vec4 pixel = texture2D(source, gl_FragCoord.xy / size);
  lowp vec4 pixelLeft = texture2D(source, vec2(gl_FragCoord.x - 1.0, gl_FragCoord.y) / size);
  lowp vec4 pixelRight = texture2D(source, vec2(gl_FragCoord.x + 1.0, gl_FragCoord.y) / size);
  lowp vec4 pixelUp = texture2D(source, vec2(gl_FragCoord.x, gl_FragCoord.y - 1.0) / size);
  lowp vec4 pixelDown = texture2D(source, vec2(gl_FragCoord.x, gl_FragCoord.y + 1.0) / size);
  
  gl_FragColor = vec4(((pixelLeft.r + pixelUp.r + pixelRight.r + pixelDown.r) / 2.0 - pixel.g) * damping, pixel.r, 0.0, 1.0);
}
`;

/**
 * Set up the quad buffer for rendering
 */
Waves.prototype.useBuffer = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.programDistort.aPosition);
    this.gl.vertexAttribPointer(this.programDistort.aPosition, 2, this.gl.FLOAT, false, 8, 0);
};

/**
 * Propagate the waves on a water plane
 * @param {WaterPlane} water A water plane
 */
Waves.prototype.propagate = function(water) {
    this.programPropagate.use();

    water.flip();
    water.getFront().target();

    this.gl.uniform2f(this.programPropagate.uSize, water.width, water.height);

    this.useBuffer();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getBack().texture);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Render waves
 * @param {WebGLTexture} background A background texture
 * @param {WaterPlane} water A water plane to shade the background with
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 */
Waves.prototype.render = function(background, water, width, height) {
    this.programDistort.use();

    this.gl.uniform1i(this.programDistort.uBackground, 0);
    this.gl.uniform1i(this.programDistort.uDisplacement, 1);
    this.gl.uniform2f(this.programDistort.uSize, width, height);

    this.useBuffer();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, background);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getFront().texture);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this object
 */
Waves.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.programDistort.free();
    this.programPropagate.free();
};