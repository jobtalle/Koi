/**
 * A sand synthesizer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Sand = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "depth"],
        ["scale"],
        [
            new Shader.Constant("colorDeep", "f", [
                this.COLOR_DEEP.r,
                this.COLOR_DEEP.g,
                this.COLOR_DEEP.b]),
            new Shader.Constant("colorShallow", "f", [
                this.COLOR_SHALLOW.r,
                this.COLOR_SHALLOW.g,
                this.COLOR_SHALLOW.b])
        ]);
    this.vao = gl.vao.createVertexArrayOES();

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vao,
            () => {
                gl.enableVertexAttribArray(this.program["aPosition"]);
                gl.vertexAttribPointer(this.program["aPosition"],
                    2, gl.FLOAT, false, 16, 0);
                gl.enableVertexAttribArray(this.program["aDepth"]);
                gl.vertexAttribPointer(this.program["aDepth"],
                    2, gl.FLOAT, false, 16, 8);
            }
        )
    ]);
};

Sand.prototype = Object.create(Meshed.prototype);

Sand.prototype.COLOR_DEEP = Color.fromCSS("--color-water-deep");
Sand.prototype.COLOR_SHALLOW = Color.fromCSS("--color-water-shallow");

Sand.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 depth;

varying vec2 iDepth;

void main() {
  iDepth = depth;

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Sand.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise2 + `
uniform mediump float scale;
uniform lowp vec3 colorDeep;
uniform lowp vec3 colorShallow;

varying mediump vec2 iDepth;

void main() {
  lowp float noise = pow(random2(gl_FragCoord.xy), 9.0);
  lowp float hill = cubicNoise(1.5 * gl_FragCoord.xy / scale);
  lowp vec3 color = mix(colorShallow, colorDeep, iDepth.y * (0.5 - 0.5 * cos(3.141592 * sqrt(iDepth.x))));
  
  gl_FragColor = vec4(color * (noise * 0.3 * hill + 0.85), 1.0);
}
`;

/**
 * Write a sand texture
 * @param {RandomSource} randomSource A random source
 * @param {Number} scale The render scale
 */
Sand.prototype.write = function(randomSource, scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, randomSource.texture);

    this.gl.uniform1f(this.program["uScale"], scale);

    this.renderMesh();
};

/**
 * Free all resources maintained by this system
 */
Sand.prototype.free = function() {
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};