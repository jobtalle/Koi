/**
 * A sand synthesizer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {RandomSource} randomSource A random source
 * @constructor
 */
const Sand = function(gl, randomSource) {
    this.gl = gl;
    this.randomSource = randomSource;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "scale", "colorDeep", "colorShallow"],
        ["position", "depth"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Sand.prototype.COLOR_DEEP = Color.fromCSS("water-deep");
Sand.prototype.COLOR_SHALLOW = Color.fromCSS("water-shallow");

Sand.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform mediump float scale;

attribute vec2 position;
attribute vec2 depth;

varying vec2 iDepth;

void main() {
  iDepth = depth;

  gl_Position = vec4(vec2(2.0, -2.0) * position / size * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

// TODO: Use 2D cubic noise
Sand.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise + `
uniform mediump float scale;
uniform lowp vec3 colorDeep;
uniform lowp vec3 colorShallow;

varying mediump vec2 iDepth;

void main() {
  lowp float noise = pow(random2(gl_FragCoord.xy), 9.0);
  lowp float hill = cubicNoise(vec3(1.5 * gl_FragCoord.xy / scale, 0.0));
  lowp vec3 color = mix(colorShallow, colorDeep, iDepth.y * (0.5 - 0.5 * cos(3.141592 * sqrt(iDepth.x))));
  
  gl_FragColor = vec4(color * (noise * 0.3 * hill + 0.85), 1.0);
}
`;

/**
 * Set the mesh for the sand renderer
 * @param {Mesh} mesh The mesh
 */
Sand.prototype.setMesh = function(mesh) {
    this.indexCount = mesh.indexCount;

    this.gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program["aPosition"]);
    this.gl.vertexAttribPointer(this.program["aPosition"], 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.program["aDepth"]);
    this.gl.vertexAttribPointer(this.program["aDepth"], 2, this.gl.FLOAT, false, 16, 8);
};

/**
 * Write a sand texture
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {Number} scale The render scale
 */
Sand.prototype.write = function(width, height, scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.randomSource.texture);

    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform1f(this.program["uScale"], scale);
    this.gl.uniform3f(this.program["uColorDeep"], this.COLOR_DEEP.r, this.COLOR_DEEP.g, this.COLOR_DEEP.b);
    this.gl.uniform3f(this.program["uColorShallow"], this.COLOR_SHALLOW.r, this.COLOR_SHALLOW.g, this.COLOR_SHALLOW.b);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by this system
 */
Sand.prototype.free = function() {
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};