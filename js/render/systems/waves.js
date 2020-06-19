/**
 * A wave simulation shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Waves = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "damping"],
        ["position"]);
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
    ])
};

Waves.prototype = Object.create(Meshed.prototype);

Waves.prototype.DAMPING = .997;

Waves.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = 0.5 * position + 0.5;

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Waves.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;
uniform mediump float damping;

varying mediump vec2 iUv;

void main() {
  mediump vec2 step = 1.0 / size;
  mediump vec3 state = texture2D(source, iUv).rgb;
  mediump float hLeft = texture2D(source, vec2(iUv.x - step.x, iUv.y)).r;
  mediump float hRight = texture2D(source, vec2(iUv.x + step.x, iUv.y)).r;
  mediump float hUp = texture2D(source, vec2(iUv.x, iUv.y - step.y)).r;
  mediump float hDown = texture2D(source, vec2(iUv.x, iUv.y + step.y)).r;
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
 * Propagate the waves on a water plane
 * @param {Water} water A water plane
 * @param {InfluencePainter} influencePainter An influence painter to render wave influences
 */
Waves.prototype.propagate = function(water, influencePainter) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    water.flip();
    water.getFront().target();

    this.gl.clearColor(0.5, 0.5, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.uniform2f(this.program["uSize"], water.width, water.height);
    this.gl.uniform1f(this.program["uDamping"], this.DAMPING);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getBack().texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.renderMesh();

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    influencePainter.applyInfluences(water.influences);

    water.influences.clear();
};

/**
 * Free all resources maintained by this object
 */
Waves.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};