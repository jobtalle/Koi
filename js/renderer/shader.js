/**
 * A shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {String} vertex The vertex shader
 * @param {String} fragment The fragment shader
 * @param {Array} uniforms An array of uniforms
 * @param {Array} attributes An array of vertex attributes
 * @constructor
 */
const Shader = function(gl, vertex, fragment, uniforms, attributes) {
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

    this.use = () => {
        gl.useProgram(this.program);
    };

    this.free = () => {
        gl.deleteProgram(this.program);
    };

    for (const uniform of uniforms)
        this["u" + uniform.charAt(0).toUpperCase() + uniform.slice(1)] = gl.getUniformLocation(this.program, uniform);

    for (const attrib of attributes)
        this["a" + attrib.charAt(0).toUpperCase() + attrib.slice(1)] = gl.getAttribLocation(this.program, attrib);
};

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