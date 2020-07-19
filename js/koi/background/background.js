/**
 * The background of the scene
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Sand} sand The sand renderer
 * @param {Blit} blit The blit system
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {RandomSource} randomSource A random source
 * @param {Number} scale The render scale
 * @constructor
 */
const Background = function(
    gl,
    sand,
    blit,
    width,
    height,
    randomSource,
    scale) {
    this.gl = gl;
    this.blit = blit;
    this.bottom = new RenderTarget(gl, width, height, gl.RGB, false, gl.NEAREST);
    this.bottom.target();
    this.vao = gl.vao.createVertexArrayOES();

    sand.write(randomSource, scale);

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vao,
            () => {
                gl.enableVertexAttribArray(this.blit.program["aPosition"]);
                gl.vertexAttribPointer(this.blit.program["aPosition"],
                    2, gl.FLOAT, false, 16, 0);
            }
        )
    ])
};

Background.prototype = Object.create(Meshed.prototype);

/**
 * Render the background
 */
Background.prototype.render = function() {
    this.blit.program.use();

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.bottom.texture);

    this.renderMesh();
};

/**
 * Free all resources maintained by the background
 */
Background.prototype.free = function() {
    this.bottom.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};