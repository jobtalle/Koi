/**
 * A shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {String} vertex The vertex shader
 * @param {String} fragment The fragment shader
 * @param {String[]} attributes An array of vertex attribute names
 * @param {String[]} uniforms An array of uniform names
 * @param {Shader.Constant[]} [constants] An optional array of constant uniforms & their values
 * @constructor
 */
const Shader = function(
    gl,
    vertex,
    fragment,
    attributes,
    uniforms,
    constants = null) {
    const shaderVertex = gl.createShader(gl.VERTEX_SHADER);
    const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER);

    this.gl = gl;
    this.program = gl.createProgram();

    gl.shaderSource(shaderVertex, vertex);
    gl.compileShader(shaderVertex);

    gl.shaderSource(shaderFragment, fragment);
    gl.compileShader(shaderFragment);

    gl.attachShader(this.program, shaderVertex);
    gl.attachShader(this.program, shaderFragment);
    gl.linkProgram(this.program);
    gl.detachShader(this.program, shaderVertex);
    gl.detachShader(this.program, shaderFragment);
    gl.deleteShader(shaderVertex);
    gl.deleteShader(shaderFragment);

    for (const uniform of uniforms)
        this["u" + uniform.charAt(0).toUpperCase() + uniform.slice(1)] = gl.getUniformLocation(this.program, uniform);

    for (const attrib of attributes)
        this["a" + attrib.charAt(0).toUpperCase() + attrib.slice(1)] = gl.getAttribLocation(this.program, attrib);

    if (constants) {
        this.use();

        for (const constant of constants)
            gl["uniform" + constant.values.length.toString() + constant.type](
                gl.getUniformLocation(this.program, constant.name),
                ...constant.values);
    }
};

/**
 * A uniform constant definition
 * @param {String} name The uniform name
 * @param {String} type The type, which must be f (float) or i (integer)
 * @param {Number[]} values The element values
 * @constructor
 */
Shader.Constant = function(name, type, values) {
    this.name = name;
    this.type = type;
    this.values = values;
};

Shader.prototype.REQUIREMENT_WEIGHT = 1;

/**
 * Use this shader
 */
Shader.prototype.use = function() {
    this.gl.useProgram(this.program);
};

/**
 * Free this shader
 */
Shader.prototype.free = function() {
    this.gl.deleteProgram(this.program);
};