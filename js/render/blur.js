/**
 * A blur shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Quad} quad The quad renderer to borrow the quad mesh from
 * @constructor
 */
const Blur = function(gl, quad) {
    this.programMesh = new Shader(
        gl,
        this.SHADER_VERTEX_MESH,
        this.SHADER_FRAGMENT,
        ["position"],
        ["targetSize", "direction"]);
    this.programQuad = new Shader(
        gl,
        this.SHADER_VERTEX_QUAD,
        this.SHADER_FRAGMENT,
        ["position"],
        ["targetSize", "direction"]);
    this.vaoMesh = gl.vao.createVertexArrayOES();
    this.vaoQuad = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vaoQuad);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);

    gl.enableVertexAttribArray(this.programQuad["aPosition"]);
    gl.vertexAttribPointer(this.programQuad["aPosition"], 2, gl.FLOAT, false, 8, 0);

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vaoMesh,
            () => {
                gl.enableVertexAttribArray(this.programMesh["aPosition"]);
                gl.vertexAttribPointer(this.programMesh["aPosition"],
                    2, gl.FLOAT, false, 8, 0);
            }
        )
    ])
};

Blur.prototype = Object.create(Meshed.prototype);

Blur.prototype.SHADER_VERTEX_MESH = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Blur.prototype.SHADER_VERTEX_QUAD = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Blur.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 targetSize;
uniform mediump vec2 direction;

lowp vec4 get(int delta) {
  return texture2D(source, (gl_FragCoord.xy + direction * float(delta)) / targetSize);
}

void main() {
  gl_FragColor = (get(-2) + get(2)) * 0.06136 + (get(-1) + get(1)) * 0.24477 + get(0) * 0.38774;
}
`;

/**
 * Apply 5x5 gaussian blur to the currently set mesh
 * @param {RenderTarget} target A render target to blur
 * @param {RenderTarget} intermediate An intermediate render target with the same properties as target
 */
Blur.prototype.applyMesh = function(target, intermediate) {
    intermediate.target();

    this.programMesh.use();

    this.gl.vao.bindVertexArrayOES(this.vaoMesh);

    this.gl.uniform2f(this.programMesh["uTargetSize"], target.width, target.height);
    this.gl.uniform2f(this.programMesh["uDirection"], 1, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.renderMesh();

    target.target();

    this.gl.uniform2f(this.programMesh["uDirection"], 0, 1);

    this.gl.bindTexture(this.gl.TEXTURE_2D, intermediate.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.renderMesh();
};

/**
 * Apply 5x5 gaussian blur to a fullscreen quad
 * @param {RenderTarget} target A render target to blur
 * @param {RenderTarget} intermediate An intermediate render target with the same properties as target
 */
Blur.prototype.applyQuad = function(target, intermediate) {
    intermediate.target();

    this.programQuad.use();

    this.gl.vao.bindVertexArrayOES(this.vaoQuad);

    this.gl.uniform2f(this.programQuad["uTargetSize"], target.width, target.height);
    this.gl.uniform2f(this.programQuad["uDirection"], 1, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    target.target();

    this.gl.uniform2f(this.programQuad["uDirection"], 0, 1);

    this.gl.bindTexture(this.gl.TEXTURE_2D, intermediate.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this blur shader
 */
Blur.prototype.free = function() {
    this.gl.vao.deleteVertexArrayOES(this.vaoMesh);
    this.gl.vao.deleteVertexArrayOES(this.vaoQuad);
    this.programMesh.free();
    this.programQuad.free();
};