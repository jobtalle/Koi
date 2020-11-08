/**
 * A renderer for fish bodies
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Bodies = function(gl) {
    this.gl = gl;
    this.buffer = new MeshBuffer(gl, 4);
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        ["scale"]);
    this.programShadows = new Shader(
        gl,
        this.SHADER_SHADOWS_VERTEX,
        this.SHADER_SHADOWS_FRAGMENT,
        ["position", "uv"],
        ["scale"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.vaoShadows = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    this.buffer.bind();

    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.program["aUv"]);
    gl.vertexAttribPointer(this.program["aUv"], 2, gl.FLOAT, false, 16, 8);

    gl.vao.bindVertexArrayOES(this.vaoShadows);

    this.buffer.bind();

    gl.enableVertexAttribArray(this.programShadows["aPosition"]);
    gl.vertexAttribPointer(this.programShadows["aPosition"], 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.programShadows["aUv"]);
    gl.vertexAttribPointer(this.programShadows["aUv"], 2, gl.FLOAT, false, 16, 8);
};

Bodies.prototype.SHADER_VERTEX = `#version 100
uniform vec2 scale;

attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Bodies.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D atlas;
uniform mediump vec2 shadow;

varying mediump vec2 iUv;

void main() {
  gl_FragColor = texture2D(atlas, iUv);
}
`;

Bodies.prototype.SHADER_SHADOWS_VERTEX = `#version 100
uniform vec2 scale;

attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Bodies.prototype.SHADER_SHADOWS_FRAGMENT = `#version 100
uniform sampler2D atlas;

varying mediump vec2 iUv;

#define TRANSPARENCY 0.6

void main() {
  gl_FragColor = vec4(vec3(0.0), texture2D(atlas, iUv).a * TRANSPARENCY);
}
`;

/**
 * Draw all buffered bodies
 * @param {Atlas} atlas The atlas containing fish textures
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Boolean} shadows A boolean indicating whether shadows or actual bodies should be rendered
 * @param {Boolean} [first] A boolean indicating that this is the first time a batch is rendered, and upload is required
 */
Bodies.prototype.render = function(
    atlas,
    width,
    height,
    shadows,
    first = true) {
    this.gl.vao.bindVertexArrayOES(this.vao);

    if (first)
        this.buffer.upload();

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, atlas.renderTarget.texture);

    if (shadows) {
        this.programShadows.use();

        this.gl.uniform2f(this.programShadows["uScale"], 2 / width, -2 / height);
        this.buffer.render();
    }
    else {
        this.program.use();

        this.gl.uniform2f(this.program["uScale"], 2 / width, -2 / height);
        this.buffer.render();
    }

    this.gl.disable(this.gl.BLEND);
};

/**
 * Free all resources maintained by this body renderer
 */
Bodies.prototype.free = function() {
    this.buffer.free();
    this.program.free();
    this.programShadows.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.gl.vao.deleteVertexArrayOES(this.vaoShadows);
};