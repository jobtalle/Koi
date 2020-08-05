/**
 * The pattern renderer
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Palettes} palettes The palettes
 * @constructor
 */
const Patterns = function(gl, palettes) {
    this.gl = gl;
    this.palettes = palettes;
    this.buffer = gl.createBuffer();
    this.programBase = LayerBase.prototype.createShader(gl);
    this.vaoBase = this.createVAO(gl, this.programBase);
    this.programSpots = LayerSpots.prototype.createShader(gl);
    this.vaoSpots = this.createVAO(gl, this.programSpots);
    this.programShapeBody = LayerShapeBody.prototype.createShader(gl);
    this.vaoShapeBody = this.createVAO(gl, this.programShapeBody);
    this.programShapeFin = LayerShapeFin.prototype.createShader(gl);
    this.vaoShapeFin = this.createVAO(gl, this.programShapeFin);
    this.palettes = new Palettes();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 64, gl.DYNAMIC_DRAW);
};

/**
 * Create a VAO for a pattern shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program The shader program to create a VAO for
 */
Patterns.prototype.createVAO = function(gl, program) {
    const vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(program["aPosition"]);
    gl.vertexAttribPointer(program["aPosition"], 2, gl.FLOAT, false, 16, 0);

    if (program["aUv"] !== undefined) {
        gl.enableVertexAttribArray(program["aUv"]);
        gl.vertexAttribPointer(program["aUv"], 2, gl.FLOAT, false, 16, 8);
    }

    return vao;
};

/**
 * Write a specific layer
 * @param {Object} layer A valid pattern layer object
 * @param {Shader} program The shader program for this layer type
 * @param {WebGLVertexArrayObjectOES} vao The VAO for this layer type
 * @param {Color} [color] The palette sample, if this layer samples
 */
Patterns.prototype.writeLayer = function(
    layer,
    program,
    vao,
    color = null) {
    program.use();

    layer.configure(this.gl, program, color);

    this.gl.vao.bindVertexArrayOES(vao);

    if (program["uSize"] !== undefined)
        this.gl.uniform2f(program["uSize"], Atlas.prototype.RATIO, 1);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Write a pattern
 * @param {Pattern} pattern A pattern
 * @param {RandomSource} randomSource A random source
 * @param {AtlasRegion} region A region on the atlas on which the pattern may be written
 * @param {Number} pixelSize The pixel size
 */
Patterns.prototype.write = function(pattern, randomSource, region, pixelSize) {
    const paletteTrack = new PaletteTrack(this.palettes.base, pattern.base);
    // let previousLayer = pattern.base;
    // let sample = this.palettes.base.sample(pattern.base.paletteSample);
    // let palette = this.palettes.base;

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, randomSource.texture);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array([
        2 * (region.uBodyStart + pixelSize) - 1,
        2 * (region.vStart + pixelSize) - 1,
        0, 0,
        2 * (region.uBodyStart + pixelSize) - 1,
        2 * (region.vEnd - pixelSize) - 1,
        0, 1,
        2 * (region.uFinEnd - pixelSize) - 1,
        2 * (region.vEnd - pixelSize) - 1,
        1, 1,
        2 * (region.uFinEnd - pixelSize) - 1,
        2 * (region.vStart + pixelSize) - 1,
        1, 0
    ]));

    this.writeLayer(pattern.base, this.programBase, this.vaoBase, paletteTrack.next(pattern.base));

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array([
        2 * (region.uBodyStart + pixelSize) - 1,
        2 * (region.vStart + pixelSize) - 1,
        0, 0,
        2 * (region.uBodyStart + pixelSize) - 1,
        2 * (region.vEnd - pixelSize) - 1,
        0, 1,
        2 * region.uBodyEnd - 1,
        2 * (region.vEnd - pixelSize) - 1,
        1, 1,
        2 * region.uBodyEnd - 1,
        2 * (region.vStart + pixelSize) - 1,
        1, 0
    ]));

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    for (const layer of pattern.layers) {
        const color = paletteTrack.next(layer);

        if (!color)
            break;

        switch (layer.id) {
            case LayerSpots.prototype.ID:
                this.writeLayer(layer, this.programSpots, this.vaoSpots, color);

                break;
        }
    }

    this.gl.blendFunc(this.gl.ZERO, this.gl.SRC_COLOR)

    this.writeLayer(pattern.shapeBody, this.programShapeBody, this.vaoShapeBody);

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array([
        2 * region.uFinStart - 1,
        2 * (region.vStart + pixelSize) - 1,
        0, 0,
        2 * region.uFinStart - 1,
        2 * (region.vEnd - pixelSize) - 1,
        0, 1,
        2 * (region.uFinEnd - pixelSize) - 1,
        2 * (region.vEnd - pixelSize) - 1,
        1, 1,
        2 * (region.uFinEnd - pixelSize) - 1,
        2 * (region.vStart + pixelSize) - 1,
        1, 0
    ]));

    this.writeLayer(pattern.shapeFin, this.programShapeFin, this.vaoShapeFin);

    this.gl.disable(this.gl.BLEND);
};

/**
 * Free all resources maintained by the pattern renderer
 */
Patterns.prototype.free = function() {
    this.programBase.free();
    this.gl.vao.deleteVertexArrayOES(this.vaoBase);
    this.programSpots.free();
    this.gl.vao.deleteVertexArrayOES(this.vaoSpots);
    this.programShapeBody.free();
    this.gl.vao.deleteVertexArrayOES(this.vaoShapeBody);
    this.programShapeFin.free();
    this.gl.vao.deleteVertexArrayOES(this.vaoShapeFin);

    this.gl.deleteBuffer(this.buffer);
};