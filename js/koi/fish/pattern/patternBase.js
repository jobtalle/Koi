/**
 * A base color for a fish pattern
 * @param {Palette.Sample} sample A palette sample
 * @constructor
 */
const PatternBase = function(sample) {
    this.sample = sample;
};

PatternBase.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
PatternBase.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D palette;
uniform mediump vec2 sample;

void main() {
  gl_FragColor = vec4(texture2D(palette, sample).rgb, 1.0);
}
`;

PatternBase.prototype.PALETTE = new Palette([
    new Palette.Color(new Palette.Sample(50, 30), Color.fromCSS("fish-base-1")),
    new Palette.Color(new Palette.Sample(200, 50), Color.fromCSS("fish-base-2")),
    new Palette.Color(new Palette.Sample(60, 20), Color.fromCSS("fish-base-3")),
    new Palette.Color(new Palette.Sample(160, 180), Color.fromCSS("fish-base-4"))
]);

/**
 * Deserialize a base pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
PatternBase.deserialize = function(buffer) {
    return new PatternBase(Pattern.Sample.deserialize(buffer));
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
 */
PatternBase.prototype.configure = function(gl, program) {
    gl.uniform1i(program["uPalette"], Patterns.prototype.TEXTURE_PALETTE_BASE);
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