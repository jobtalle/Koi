/**
 * A GPU accelerated voronoi diagram renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Quad} quad A quad renderer
 * @constructor
 */
const Voronoi = function(gl, quad) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "locations", "colors", "seedCount"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);

    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

Voronoi.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying mediump vec2 iUv;

void main() {
  iUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Voronoi.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump vec2 locations[24];
uniform lowp vec3 colors[24];
uniform int seedCount;
uniform mediump vec2 size;

varying mediump vec2 iUv;

lowp vec3 getNearest(mediump vec2 from) {
  lowp vec3 color = colors[0];
  mediump float shortest = dot(size, size);
  
  for (int i = 0; i < 24; ++i) {
    if (i == seedCount)
      break;
    else {
      for (int y = -1; y < 2; ++y) for (int x = -1; x < 2; ++x) {
        mediump vec2 delta = locations[i] - from + vec2(float(x), float(y)) * size;
        mediump float distance = dot(delta, delta);
        
        if (distance < shortest) {
          shortest = distance;
          color = colors[i];
        }
      }
    }
  }
  
  return color;
}

void main() {
  gl_FragColor = vec4(getNearest(iUv * size), 1.0);
}
`;

/**
 * Make a voronoi diagram on a texture based on seeds
 * @param {WebGLTexture} texture A WebGL texture
 * @param {Number} width The texture width
 * @param {Number} height The texture height
 * @param {Number} seedCount The number of seed pixels
 * @param {Vector2[]} locations The seed locations
 * @param {Color[]} colors The seed colors
 */
Voronoi.prototype.apply = function(
    texture,
    width,
    height,
    seedCount,
    locations,
    colors) {
    const framebuffer = this.gl.createFramebuffer();
    const locationValues = [];
    const colorValues = [];

    for (let seed = 0; seed < seedCount; ++seed) {
        locationValues.push(locations[seed].x, locations[seed].y);
        colorValues.push(colors[seed].r, colors[seed].g, colors[seed].b);
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);
    this.gl.viewport(0, 0, width, height);

    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform2fv(this.program["uLocations"], new Float32Array(locationValues));
    this.gl.uniform3fv(this.program["uColors"], new Float32Array(colorValues));
    this.gl.uniform1i(this.program["uSeedCount"], seedCount);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    this.gl.deleteFramebuffer(framebuffer);
};

/**
 * Free this voronoi diagram renderer
 */
Voronoi.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};