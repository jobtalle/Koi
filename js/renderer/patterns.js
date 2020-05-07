/**
 * The pattern renderer
 * @param {WebGLRenderingContext} gl A webGL context
 * @constructor
 */
const Patterns = function(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.programBase = PatternBase.prototype.createShader(gl);
    this.programSpots = PatternSpots.prototype.createShader(gl);
    this.programShape = PatternShape.prototype.createShader(gl);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, 64, gl.STREAM_DRAW);
};

/**
 * Write a specific layer
 * @param {Object} layer A valid pattern layer object
 * @param {Shader} program The shader program for this layer type
 */
Patterns.prototype.writeLayer = function(layer, program) {
    program.use();

    layer.configure(this.gl, program);

    this.gl.enableVertexAttribArray(program.aPosition);
    this.gl.vertexAttribPointer(program.aPosition, 2, this.gl.FLOAT, false, 16, 0);

    if (program.aUv) {
        this.gl.enableVertexAttribArray(program.aUv);
        this.gl.vertexAttribPointer(program.aUv, 2, this.gl.FLOAT, false, 16, 8);
    }

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Write a pattern
 * @param {Pattern} pattern A pattern
 */
Patterns.prototype.write = function(pattern) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array([
        2 * pattern.slot.x - 1,
        2 * pattern.slot.y - 1,
        0, 0,
        2 * pattern.slot.x - 1,
        2 * (pattern.slot.y + pattern.size.y) - 1,
        0, 1,
        2 * (pattern.slot.x + pattern.size.x) - 1,
        2 * (pattern.slot.y + pattern.size.y) - 1,
        1, 1,
        2 * (pattern.slot.x + pattern.size.x) - 1,
        2 * pattern.slot.y - 1,
        1, 0
    ]));

    for (const layer of pattern.layers) switch (layer.constructor) {
        case PatternBase:
            this.writeLayer(layer, this.programBase);

            break;
        case PatternSpots:
            this.writeLayer(layer, this.programSpots);

            break;
    }

    this.gl.blendFunc(this.gl.ZERO, this.gl.SRC_COLOR)
    this.writeLayer(pattern.shape, this.programShape);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
};

/**
 * Free all resources maintained by the pattern renderer
 */
Patterns.prototype.free = function() {
    this.programBase.free();
    this.programSpots.free();
    this.programShape.free();

    this.gl.deleteBuffer(this.buffer);
};