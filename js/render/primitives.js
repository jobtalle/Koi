// TODO: Just phase the whole thing out, won't be needed when fish have their own mesh renderer
/**
 * The primitives renderer
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Primitives = function(gl) {
    this.gl = gl;
    this.programLines = new Shader(
        this.gl,
        this.SHADER_LINES_VERTEX,
        this.SHADER_LINES_FRAGMENT,
        ["transform1", "transform2"],
        ["position", "color"]);
    this.programStrip = new Shader(
        this.gl,
        this.SHADER_STRIP_VERTEX,
        this.SHADER_STRIP_FRAGMENT,
        ["transform1", "transform2"],
        ["position", "uv"]);
    this.transformBase = new Transform(2, 0, 0, 0, -2, 0); // TODO: Maybe this doesn't need to be a matrix
    this.transformStack = [this.transformBase];
    this.vertices = [];
    this.indices = [];
    this.bufferVertices = this.gl.createBuffer();
    this.bufferIndices = this.gl.createBuffer();
    this.transformIndex = 0;
    this.bufferVerticesCapacity = 0;
    this.bufferIndicesCapacity = 0;
    this.programCurrent = null;
    this.programActive = null;
    this.mode = -1;
    this.width = 0;
    this.height = 0;
};

Primitives.prototype.MODE_LINES = 0;
Primitives.prototype.MODE_STRIP = 1;
Primitives.prototype.SHADER_POSITION = `
gl_Position = vec4((position * mat2(transform1.xy, transform2.xy) + vec2(transform1.z, transform2.z)) *
  vec2(transform1.w, transform2.w) + vec2(-1, 1), 0, 1);
`;
Primitives.prototype.SHADER_LINES_VERTEX = `#version 100
uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec4 color;

varying vec4 v_color;

void main() {
  v_color = color;` + Primitives.prototype.SHADER_POSITION + `
}
`;
Primitives.prototype.SHADER_LINES_FRAGMENT = `#version 100
varying mediump vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;
Primitives.prototype.SHADER_STRIP_VERTEX = `#version 100
uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
  v_uv = uv;` + Primitives.prototype.SHADER_POSITION + `
}
`;
Primitives.prototype.SHADER_STRIP_FRAGMENT = `#version 100
uniform sampler2D atlas;

varying mediump vec2 v_uv;

void main() {
  gl_FragColor = texture2D(atlas, v_uv);
}
`;

/**
 * Upload the current transform to the currently bound shader
 */
Primitives.prototype.updateTransform = function() {
    const transform = this.transformStack[this.transformIndex];

    this.gl.uniform4f(this.programCurrent.uTransform1, transform._00, transform._10, transform._20, 1 / this.width);
    this.gl.uniform4f(this.programCurrent.uTransform2, transform._01, transform._11, transform._21, 1 / this.height);
};

/**
 * Upload the current vertex & index buffers to the GPU
 */
Primitives.prototype.updateBuffers = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferVertices);

    if (this.vertices.length > this.bufferVerticesCapacity) {
        this.bufferVerticesCapacity = this.vertices.length;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.bufferVerticesCapacity << 2, this.gl.DYNAMIC_DRAW);
    }

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.vertices));

    if (this.indices.length !== 0) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);

        if (this.indices.length > this.bufferIndicesCapacity) {
            this.bufferIndicesCapacity = this.indices.length;

            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndicesCapacity << 2, this.gl.DYNAMIC_DRAW);
        }

        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.indices));
    }
};

/**
 * Set the shader program
 * @param {Shader} program The shader program
 * @param {Number} mode The render mode
 */
Primitives.prototype.setProgram = function(program, mode) {
    if (this.programCurrent !== program) {
        this.flush();

        if ((this.programCurrent = program) !== null) {
            if (this.programCurrent !== this.programActive) {
                this.programCurrent.use();
                this.programActive = this.programCurrent;
            }

            this.updateTransform();
        }
    }
    else if (this.mode !== mode)
        this.flush();

    this.mode = mode;
};

/**
 * Render all buffered lines
 */
Primitives.prototype.renderLines = function() {
    this.updateBuffers();

    this.gl.enableVertexAttribArray(this.programLines.aPosition);
    this.gl.vertexAttribPointer(this.programLines.aPosition, 2, this.gl.FLOAT, false, 24, 0);
    this.gl.enableVertexAttribArray(this.programLines.aColor);
    this.gl.vertexAttribPointer(this.programLines.aColor, 4, this.gl.FLOAT, false, 24, 8);
    this.gl.drawArrays(this.gl.LINES, 0, this.vertices.length / 6);

    this.vertices.length = 0;
};

/**
 * Render the buffered strip
 */
Primitives.prototype.renderStrip = function() {
    this.updateBuffers();

    this.gl.enableVertexAttribArray(this.programStrip.aPosition);
    this.gl.vertexAttribPointer(this.programStrip.aPosition, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.programStrip.aUv);
    this.gl.vertexAttribPointer(this.programStrip.aUv, 2, this.gl.FLOAT, false, 16, 8);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertices.length >> 2);

    this.vertices.length = 0;
};

/**
 * Render all queued render commands
 */
Primitives.prototype.flush = function() {
    switch (this.mode) {
        case this.MODE_LINES:
            this.renderLines();

            break;
        case this.MODE_STRIP:
            this.renderStrip();

            break;
    }
};

/**
 * Get the current transform
 * @returns {Transform} The currently active transform which may be modified
 */
Primitives.prototype.getTransform = function() {
    return this.transformStack[this.transformIndex];
};

/**
 * Save the current transform & push a new one on the stack
 */
Primitives.prototype.transformPush = function() {
    this.setProgram(null, -1);

    if (++this.transformIndex === this.transformStack.length)
        this.transformStack.push(this.transformStack[this.transformIndex - 1].copy());
    else
        this.transformStack[this.transformIndex].set(this.transformStack[this.transformIndex - 1]);
};

/**
 * Pop the current transform from the stack, restoring the previously pushed one
 */
Primitives.prototype.transformPop = function() {
    this.setProgram(null, -1);

    --this.transformIndex;
};

/**
 * Draw a line
 * @param {Number} x1 The start X coordinate
 * @param {Number} y1 The start Y coordinate
 * @param {Color} color1 The color at the line start
 * @param {Number} x2 The end X coordinate
 * @param {Number} y2 The end Y coordinate
 * @param {Color} color2 The color at the line end
 */
Primitives.prototype.drawLine = function(x1, y1, color1, x2, y2, color2) {
    this.setProgram(this.programLines, this.MODE_LINES);

    this.vertices.push(
        x1, y1, color1.r, color1.g, color1.b, color1.a,
        x2, y2, color2.r, color2.g, color2.b, color2.a);
};

/**
 * Add a point to the textured strip
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} u The texture U coordinate
 * @param {Number} v The texture V coordinate
 */
Primitives.prototype.drawStrip = function(x, y, u, v) {
    this.setProgram(this.programStrip, this.MODE_STRIP);

    this.vertices.push(x, y, u, v);
};

/**
 * Add a point to the textured strip which is the start or the end of a separated strip mesh
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} u The texture U coordinate
 * @param {Number} v The texture V coordinate
 */
Primitives.prototype.cutStrip = function(x, y, u, v) {
    this.setProgram(this.programStrip, this.MODE_STRIP);

    this.vertices.push(x, y, u, v, x, y, u, v);
};

/**
 * Draw a textured quad
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} width The width
 * @param {Number} height The height
 */
Primitives.prototype.drawQuad = function(x, y, width, height) {
    // TODO: Don't use strip here
    this.cutStrip(x, y, 0, 0);
    this.drawStrip(x, y + height,0, 1);
    this.cutStrip(x + width, y + height,1, 1);
    this.cutStrip(x, y, 0, 0);
    this.drawStrip(x + width, y,1, 0);
    this.cutStrip(x + width, y + height,1, 1);
};

/**
 * Resize the viewport
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
Primitives.prototype.setViewport = function(width, height) {
    this.width = width;
    this.height = height;
    this.programActive = this.programCurrent = null;
};

/**
 * Set the texture used for textured primitive drawing
 * @param {WebGLTexture} texture A texture
 */
Primitives.prototype.setTexture = function(texture) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
};

/**
 * Free this primitives renderer
 */
Primitives.prototype.free = function() {
    this.programLines.free();
    this.programStrip.free();

    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};