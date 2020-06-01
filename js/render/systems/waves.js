/**
 * A wave simulation shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Waves = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_PROPAGATE_VERTEX,
        this.SHADER_PROPAGATE_FRAGMENT,
        ["size", "scale", "damping"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Waves.prototype.DAMPING = .997;

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

    this.gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, this.gl.FLOAT, false, 8, 0);
};

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
    this.gl.uniform1f(this.program["uScale"], water.SCALE);
    this.gl.uniform1f(this.program["uDamping"], this.DAMPING);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getBack().texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    influencePainter.applyInfluences(water.influences);
};

/**
 * Free all resources maintained by this object
 */
Waves.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};