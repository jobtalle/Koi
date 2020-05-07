/**
 * The renderer
 * @param {HTMLCanvasElement} canvas The canvas to render on
 * @param {Color} clearColor A background color to clear to
 * @constructor
 */
const Renderer = function(canvas, clearColor = new Color(.2, .2, .2)) {
    this.gl =
        canvas.getContext("webgl", {alpha: false}) ||
        canvas.getContext("experimental-webgl", {alpha: false});
    this.patterns = new Patterns(this.gl);
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
    this.transformBase = new Transform();
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
    this.currentMesh = null;
    this.width = 0;
    this.height = 0;
    this.mode = -1;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);

    this.resize(canvas.width, canvas.height);
};

Renderer.prototype.MODE_MESH = 0;
Renderer.prototype.MODE_LINES = 1;
Renderer.prototype.MODE_STRIP = 2;
Renderer.prototype.SHADER_POSITION = `
gl_Position = vec4((position * mat2(transform1.xy, transform2.xy) + vec2(transform1.z, transform2.z)) *
  vec2(transform1.w, transform2.w) + vec2(-1, 1), 0, 1);
`;
Renderer.prototype.SHADER_LINES_VERTEX = `#version 100
uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec4 color;

varying vec4 v_color;

void main() {
  v_color = color;` + Renderer.prototype.SHADER_POSITION + `
}
`;
Renderer.prototype.SHADER_LINES_FRAGMENT = `#version 100
varying mediump vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;
Renderer.prototype.SHADER_STRIP_VERTEX = `#version 100
uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
  v_uv = uv;` + Renderer.prototype.SHADER_POSITION + `
}
`;
Renderer.prototype.SHADER_STRIP_FRAGMENT = `#version 100
uniform sampler2D atlas;

varying mediump vec2 v_uv;

void main() {
  gl_FragColor = texture2D(atlas, v_uv);
}
`;

/**
 * Upload the current transform to the currently bound shader
 */
Renderer.prototype.updateTransform = function() {
    const transform = this.transformStack[this.transformIndex];

    this.gl.uniform4f(this.programCurrent.uTransform1, transform._00, transform._10, transform._20, 1 / this.width);
    this.gl.uniform4f(this.programCurrent.uTransform2, transform._01, transform._11, transform._21, 1 / this.height);
};

/**
 * Upload the current vertex & index buffers to the GPU
 */
Renderer.prototype.updateBuffers = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferVertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndices);

    if (this.vertices.length > this.bufferVerticesCapacity) {
        this.bufferVerticesCapacity = this.vertices.length;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.bufferVerticesCapacity << 2, this.gl.DYNAMIC_DRAW);
    }

    if (this.indices.length > this.bufferIndicesCapacity) {
        this.bufferIndicesCapacity = this.indices.length;

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndicesCapacity << 2, this.gl.DYNAMIC_DRAW);
    }

    if (this.vertices.length !== 0)
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.vertices));

    if (this.indices.length !== 0)
        this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(this.indices));
};

/**
 * Set the shader program
 * @param {Shader} program The shader program
 * @param {Number} mode The render mode
 */
Renderer.prototype.setProgram = function(program, mode) {
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
 * Render a mesh
 */
Renderer.prototype.renderMesh = function() {
    // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.currentMesh.bufferVertices);
    // this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.currentMesh.bufferIndices);
    //
    // this.gl.enableVertexAttribArray(this.programSprites.aPosition);
    // this.gl.vertexAttribPointer(this.programSprites.aPosition, 2, this.gl.FLOAT, false, 16, 0);
    // this.gl.enableVertexAttribArray(this.programSprites.aUv);
    // this.gl.vertexAttribPointer(this.programSprites.aUv, 2, this.gl.FLOAT, false, 16, 8);
    // this.gl.drawElements(this.gl.TRIANGLES, this.currentMesh.this.indices.length, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Render all buffered lines
 */
Renderer.prototype.renderLines = function() {
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
Renderer.prototype.renderStrip = function() {
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
Renderer.prototype.flush = function() {
    switch (this.mode) {
        case this.MODE_MESH:
            this.renderMesh();

            break;
        case this.MODE_LINES:
            this.renderLines();

            break;
        case this.MODE_STRIP:
            this.renderStrip();

            break;
    }
};

/**
 * Create the GPU buffers for a mesh
 * @param {Mesh} mesh A mesh
 */
Renderer.prototype.createMeshBuffers = function(mesh) {
    mesh.bufferVertices = this.gl.createBuffer();
    mesh.bufferIndices = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.bufferVertices);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.bufferIndices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), this.gl.STATIC_DRAW);
};

/**
 * Upload mesh data to its buffers
 * @param {Mesh} mesh A mesh
 */
Renderer.prototype.updateMeshBuffers = function(mesh) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.bufferVertices);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(mesh.vertices));
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.bufferIndices);
    this.gl.bufferSubData(this.gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(mesh.indices));
};

/**
 * Get the current transform
 * @returns {Transform} The currently active transform which may be modified
 */
Renderer.prototype.getTransform = function() {
    return this.transformStack[this.transformIndex];
};

/**
 * Save the current transform & push a new one on the stack
 */
Renderer.prototype.transformPush = function() {
    this.setProgram(null, -1);

    if (++this.transformIndex === this.transformStack.length)
        this.transformStack.push(this.transformStack[this.transformIndex - 1].copy());
    else
        this.transformStack[this.transformIndex].set(this.transformStack[this.transformIndex - 1]);
};

/**
 * Pop the current transform from the stack, restoring the previously pushed one
 */
Renderer.prototype.transformPop = function() {
    this.setProgram(null, -1);

    --this.transformIndex;
};

/**
 * Draw a mesh
 * @param {Mesh} mesh A mesh
 */
Renderer.prototype.drawMesh = function(mesh) {
    // this.setProgram(this.programSprites, this.MODE_MESH);
    //
    // this.currentMesh = mesh;
    //
    // if (mesh.bufferVertices === null)
    //     this.createMeshBuffers(mesh);
    // else if (mesh.updated)
    //     this.updateMeshBuffers(mesh);
    //
    // this.setProgram(null, -1);
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
Renderer.prototype.drawLine = function(x1, y1, color1, x2, y2, color2) {
    this.setProgram(this.programLines, this.MODE_LINES);

    this.vertices.push(
        x1, y1, color1.r, color1.g, color1.b, color1.a,
        x2, y2, color2.r, color2.g, color2.b, color2.a);
};

/**
 * Add a point to the strip
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} u The texture U coordinate
 * @param {Number} v The texture V coordinate
 */
Renderer.prototype.drawStrip = function(x, y, u, v) {
    this.setProgram(this.programStrip, this.MODE_STRIP);

    this.vertices.push(x, y, u, v);
};

/**
 * Add a point to the strip which is the start or the end of a separated strip mesh
 * @param {Number} x The X coordinate
 * @param {Number} y The Y coordinate
 * @param {Number} u The texture U coordinate
 * @param {Number} v The texture V coordinate
 */
Renderer.prototype.cutStrip = function(x, y, u, v) {
    this.setProgram(this.programStrip, this.MODE_STRIP);

    this.vertices.push(x, y, u, v, x, y, u, v);
};

/**
 * Free a mesh
 * @param {Mesh} mesh The mesh to free
 */
Renderer.prototype.freeMesh = function(mesh) {
    if (mesh.bufferVertices === null)
        return;

    this.gl.deleteBuffer(mesh.bufferVertices);
    this.gl.deleteBuffer(mesh.bufferIndices);

    mesh.bufferVertices = mesh.bufferIndices = null;
};

/**
 * Resize the render context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
Renderer.prototype.resize = function(width, height) {
    this.transformBase._00 = 2;
    this.transformBase._10 = 0;
    this.transformBase._20 = 0;
    this.transformBase._01 = 0;
    this.transformBase._11 = -2;
    this.transformBase._21 = 0;

    this.width = width;
    this.height = height;

    this.setProgram(null, -1);
};

/**
 * Clear the render context
 */
Renderer.prototype.clear = function() {
    this.gl.viewport(0, 0, this.width, this.height);
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

/**
 * Indicate that an external shader program is made active
 */
Renderer.prototype.unbindShader = function() {
    this.programActive = null;
};

/**
 * Get the width of this renderer
 * @returns {Number} The width in pixels
 */
Renderer.prototype.getWidth = function() {
    return this.width;
};

/**
 * Get the height of this renderer
 * @returns {Number} The height in pixels
 */
Renderer.prototype.getHeight = function() {
    return this.height;
};

/**
 * Free this renderer
 */
Renderer.prototype.free = function() {
    this.patterns.free();
    this.programLines.free();
    this.programStrip.free();

    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
};