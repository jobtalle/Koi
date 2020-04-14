/**
 * The renderer
 * @param {HTMLCanvasElement} canvas The canvas to render on
 * @param {Image} atlasImage An image containing the atlas
 * @param {Color} clearColor A background color to clear to
 * @constructor
 */
const Renderer = function(canvas, atlasImage, clearColor = new Color(.3, .5, 1)) {
    this.gl =
        canvas.getContext("webgl", {antialias: false}) ||
        canvas.getContext("experimental-webgl", {antialias: false});
    this.programSprites = new Shader(
        this.gl,
        this.SHADER_SPRITES_VERTEX,
        this.SHADER_SPRITES_FRAGMENT,
        ["transform1", "transform2"],
        ["position", "uv"]);
    this.programLines = new Shader(
        this.gl,
        this.SHADER_LINES_VERTEX,
        this.SHADER_LINES_FRAGMENT,
        ["transform1", "transform2"],
        ["position", "color"]);
    this.transformBase = new Transform();
    this.transformStack = [this.transformBase];
    this.vertices = [];
    this.indices = [];
    this.bufferVertices = this.gl.createBuffer();
    this.bufferIndices = this.gl.createBuffer();
    this.atlas = this.gl.createTexture();
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
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.atlas);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    this.initializeSprites(atlasImage);

    this.resize(canvas.width, canvas.height);
};

Renderer.prototype.MODE_SPRITES = 0;
Renderer.prototype.MODE_MESH = 1;
Renderer.prototype.MODE_LINES = 2;
Renderer.prototype.SHADER_POSITION = `
gl_Position = vec4((position * mat2(transform1.xy, transform2.xy) + vec2(transform1.z, transform2.z)) * vec2(transform1.w, transform2.w) + vec2(-1, 1), 0, 1);
`;
Renderer.prototype.SHADER_SPRITES_VERTEX = `
#version 100

uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec2 uv;

varying vec2 v_uv;

void main() {
    v_uv = uv;` +
    Renderer.prototype.SHADER_POSITION + `
}
`;
Renderer.prototype.SHADER_SPRITES_FRAGMENT = `
#version 100

uniform sampler2D atlas;

varying mediump vec2 v_uv;

void main() {
    gl_FragColor = texture2D(atlas, v_uv);
}
`;
Renderer.prototype.SHADER_LINES_VERTEX = `
#version 100

uniform vec4 transform1;
uniform vec4 transform2;

attribute vec2 position;
attribute vec4 color;

varying vec4 v_color;

void main() {
    v_color = color;` +
    Renderer.prototype.SHADER_POSITION + `
}
`;
Renderer.prototype.SHADER_LINES_FRAGMENT = `
#version 100

varying mediump vec4 v_color;

void main() {
    gl_FragColor = v_color;
}
`;

/**
 * Find the nearest power of 2 which is bigger than a number
 * @param {Number} number A number
 * @returns {Number} The biggest power of 2 larger than that number
 */
Renderer.prototype.nearestPow2 = function(number) {
    let n = 1;

    while (n < number)
        n <<= 1;

    return n;
};

/**
 * Initialize the sprite data
 * @param {Image} atlasImage An image containing the atlas
 */
Renderer.prototype.initializeSprites = function(atlasImage) {
    const canvas = document.createElement("canvas");

    canvas.width = this.nearestPow2(atlasImage.width);
    canvas.height = this.nearestPow2(atlasImage.height);
    canvas.getContext("2d").drawImage(atlasImage, 0, 0);

    const invWidth = 1 / canvas.width;
    const invHeight = 1 / canvas.height;
    const epsilon = 0.000001;

    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        canvas);

    for (const sprite in sprites) {
        const data = sprites[sprite];

        for (const frame of data.frames) {
            frame["uStart"] = frame.x * invWidth + epsilon;
            frame["uEnd"] = frame.uStart + data.w * invWidth - epsilon - epsilon;
            frame["vStart"] = frame.y * invHeight + epsilon;
            frame["vEnd"] = frame.vStart + data.h * invHeight - epsilon - epsilon;
        }
    }
};

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

        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.bufferVerticesCapacity << 2, this.gl.STREAM_DRAW);
    }

    if (this.indices.length > this.bufferIndicesCapacity) {
        this.bufferIndicesCapacity = this.indices.length;

        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.bufferIndicesCapacity << 2, this.gl.STREAM_DRAW);
    }

    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(this.vertices));
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
 * Render all buffered sprites
 */
Renderer.prototype.renderSprites = function() {
    this.updateBuffers();

    this.gl.enableVertexAttribArray(this.programSprites.aPosition);
    this.gl.vertexAttribPointer(this.programSprites.aPosition, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.programSprites.aUv);
    this.gl.vertexAttribPointer(this.programSprites.aUv, 2, this.gl.FLOAT, false, 16, 8);
    this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

    this.vertices.length = this.indices.length = 0;
};

/**
 * Render a mesh
 */
Renderer.prototype.renderMesh = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.currentMesh.bufferVertices);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.currentMesh.bufferIndices);

    this.gl.enableVertexAttribArray(this.programSprites.aPosition);
    this.gl.vertexAttribPointer(this.programSprites.aPosition, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.programSprites.aUv);
    this.gl.vertexAttribPointer(this.programSprites.aUv, 2, this.gl.FLOAT, false, 16, 8);
    this.gl.drawElements(this.gl.TRIANGLES, this.currentMesh.this.indices.length, this.gl.UNSIGNED_SHORT, 0);
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
 * Render all queued render commands
 */
Renderer.prototype.flush = function() {
    switch (this.mode) {
        case this.MODE_SPRITES:
            this.renderSprites();

            break;
        case this.MODE_MESH:
            this.renderMesh();

            break;
        case this.MODE_LINES:
            this.renderLines();

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
 * Draw a sprite
 * @param {Sprite} sprite The sprite to draw
 * @param {Number} x The X coordinate in pixels
 * @param {Number} y The Y coordinate in pixels
 */
Renderer.prototype.drawSprite = function(sprite, x, y) {
    this.setProgram(this.programSprites, this.MODE_SPRITES);

    const firstVertex = this.vertices.length >> 2;
    const data = sprites[sprite.name];
    const frame = data.frames[Math.floor(sprite.frame)];

    x -= data.w * sprite.origin.x;
    y -= data.h * sprite.origin.y;

    this.vertices.push(
        x, y, frame.uStart, frame.vStart,
        x, y + data.h, frame.uStart, frame.vEnd,
        x + data.w, y + data.h, frame.uEnd, frame.vEnd,
        x + data.w, y, frame.uEnd, frame.vStart);
    this.indices.push(
        firstVertex, firstVertex + 1, firstVertex + 2,
        firstVertex + 2, firstVertex + 3, firstVertex);
};

/**
 * Draw a transformed sprite
 * @param {Sprite} sprite The sprite to draw
 * @param {Transform} transform A transform to apply to the sprite
 */
Renderer.prototype.drawSpriteTransformed = function(sprite, transform) {
    this.setProgram(this.programSprites, this.MODE_SPRITES);

    const firstVertex = this.vertices.length >> 2;
    const data = sprites[sprite.name];
    const frame = data.frames[Math.floor(sprite.frame)];
    let left = -data.w * sprite.origin.x;
    let top = -data.h * sprite.origin.y;
    let right = left + data.w;
    let bottom = top + data.h;

    this.vertices.push(
        transform._20 - transform._10 * left - transform._00 * top,
        transform._21 - transform._11 * left - transform._01 * top,
        frame.uStart, frame.vStart,
        transform._20 - transform._10 * left - transform._00 * bottom,
        transform._21 - transform._11 * left - transform._01 * bottom,
        frame.uStart, frame.vEnd,
        transform._20 - transform._10 * right - transform._00 * bottom,
        transform._21 - transform._11 * right - transform._01 * bottom,
        frame.uEnd, frame.vEnd,
        transform._20 - transform._10 * right - transform._00 * top,
        transform._21 - transform._11 * right - transform._01 * top,
        frame.uEnd, frame.vStart);
    this.indices.push(
        firstVertex, firstVertex + 1, firstVertex + 2,
        firstVertex + 2, firstVertex + 3, firstVertex);
};

/**
 * Draw a rotated sprite
 * @param {Sprite} sprite The sprite to draw
 * @param {Number} x The X coordinate in pixels
 * @param {Number} y The Y coordinate in pixels
 * @param {Number} angle The angle in radians
 */
Renderer.prototype.drawSpriteRotated = function(sprite, x, y, angle) {
    this.setProgram(this.programSprites, this.MODE_SPRITES);

    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const firstVertex = this.vertices.length >> 2;
    const data = sprites[sprite.name];
    const frame = data.frames[Math.floor(sprite.frame)];

    x -= data.w * sprite.origin.x * cos - data.h * sprite.origin.y * sin;
    y -= data.w * sprite.origin.x * sin + data.h * sprite.origin.y * cos;

    this.vertices.push(
        x, y, frame.uStart, frame.vStart,
        x - data.h * sin, y + data.h * cos, frame.uStart, frame.vEnd,
        x + data.w * cos - data.h * sin, y + data.w * sin + data.h * cos, frame.uEnd, frame.vEnd,
        x + data.w * cos, y + data.w * sin, frame.uEnd, frame.vStart);
    this.indices.push(
        firstVertex, firstVertex + 1, firstVertex + 2,
        firstVertex + 2, firstVertex + 3, firstVertex);
};

/**
 * Draw a mesh
 * @param {Mesh} mesh A mesh
 */
Renderer.prototype.drawMesh = function(mesh) {
    this.setProgram(this.programSprites, this.MODE_MESH);

    this.currentMesh = mesh;

    if (mesh.bufferVertices === null)
        this.createMeshBuffers(mesh);
    else if (mesh.updated)
        this.updateMeshBuffers(mesh);

    this.setProgram(null, -1);
};

/**
 * Draw a line
 * @param {Number} x1 The start X coordinate in pixels
 * @param {Number} y1 The start Y coordinate in pixels
 * @param {Color} color1 The color at the line start
 * @param {Number} x2 The end X coordinate in pixels
 * @param {Number} y2 The end Y coordinate in pixels
 * @param {Color} color2 The color at the line end
 */
Renderer.prototype.drawLine = function(x1, y1, color1, x2, y2, color2) {
    this.setProgram(this.programLines, this.MODE_LINES);

    this.vertices.push(
        x1, y1, color1.r, color1.g, color1.b, color1.a,
        x2, y2, color2.r, color2.g, color2.b, color2.a
    );
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

    this.gl.viewport(0, 0, width, height);

    this.setProgram(null, -1);
};

/**
 * Clear the render context
 */
Renderer.prototype.clear = function() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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
    this.programSprites.free();
    this.programLines.free();

    this.gl.deleteBuffer(this.bufferVertices);
    this.gl.deleteBuffer(this.bufferIndices);
    this.gl.deleteTexture(this.atlas);
};