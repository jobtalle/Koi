/**
 * A base color for a fish pattern
 * @param {Palette.Sample} sample A palette sample
 * @constructor
 */
const PatternBase = function(sample) {
    this.sample = sample;
};

PatternBase.prototype.SHADER_VERTEX = `#version 100
uniform sampler2D palette;
uniform mediump vec2 sample;

attribute vec2 position;

varying lowp vec3 iColor;

void main() {
  iColor = texture2D(palette, sample).rgb;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
PatternBase.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Deserialize a base pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
PatternBase.deserialize = function(buffer) {
    return new PatternBase(Palette.Sample.deserialize(buffer));
};

/**
 * Serialize this base pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
PatternBase.prototype.serialize = function(buffer) {
    this.sample.serialize(buffer);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Number} texture The index of the color palette for this layer
 */
PatternBase.prototype.configure = function(gl, program, texture) {
    gl.uniform1i(program["uPalette"], texture);
    gl.uniform2f(program["uSample"], (this.sample.x + .5) / 256, (this.sample.y + .5) / 256);
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
PatternBase.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["palette", "sample"],
        ["position"]);
};