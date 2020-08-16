/**
 * A shadow renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Shadows = function(gl) {
    this.program = new Shader(
        gl,
        this.VERTEX_SHADER,
        this.FRAGMENT_SHADER,
        ["position", "depth"],
        ["meter"],
        [
            new Shader.Constant("shadowDepth", "f", [this.SHADOW_DEPTH])
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
    ])
};

Shadows.prototype = Object.create(Meshed.prototype);

Shadows.prototype.VERTEX_SHADER = `#version 100
attribute vec2 position;
attribute vec2 depth;

varying vec2 iDepth;
varying vec2 iUv;

void main() {
  iDepth = depth;
  iUv = 0.5 * position + 0.5;

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Shadows.prototype.FRAGMENT_SHADER = `#version 100
uniform sampler2D source;
uniform mediump float meter;
uniform mediump float shadowDepth;

varying mediump vec2 iDepth;
varying mediump vec2 iUv;

void main() {
  mediump float depthFactor = iDepth.y * (0.5 - 0.5 * cos(3.141592 * sqrt(iDepth.x)));
  mediump float depth = depthFactor * meter * shadowDepth;

  gl_FragColor = texture2D(source, iUv + vec2(depth * 0.5, depth));
}
`;

Shadows.prototype.SHADOW_DEPTH = .35;

/**
 * Render shadows
 * @param {ShadowBuffer} buffer A buffer to read shadows from
 * @param {Number} height The render target height
 * @param {Number} scale The render scale
 */
Shadows.prototype.render = function(buffer, height, scale) {
    this.program.use();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, buffer.renderTarget.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    this.gl.uniform1f(this.program["uMeter"], scale / height);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

    this.renderMesh();

    this.gl.disable(this.gl.BLEND);
};

/**
 * Free all resources maintained by the shadow renderer
 */
Shadows.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};