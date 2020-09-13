/**
 * A fish fin shape which will be superimposed over a pattern
 * @param {Number} roundness The fin roundness in the range [0, 255]
 * @constructor
 */
const LayerShapeFin = function(roundness) {
    this.roundness = roundness;

    Layer.call(this);
};

LayerShapeFin.prototype = Object.create(Layer.prototype);

LayerShapeFin.prototype.SAMPLER_ROUNDNESS = new SamplerPower(.25, 3, 2);

LayerShapeFin.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerShapeFin.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump float roundness;

varying mediump vec2 iUv;

#define ALPHA 0.8
#define POWER 0.15

void main() {
  mediump float phase = 0.5;
  // mediump float angle = atan(iUv.y, iUv.x) / phase - 3.141593 * (1.0 - phase);
  mediump float angle = atan(iUv.y, iUv.x) / 1.570796;
  
  if (length(iUv) > pow(sin(pow(angle, roundness) * 3.141593), POWER))
    gl_FragColor = vec4(0.0);
  else
    gl_FragColor = vec4(ALPHA);
}
`;

/**
 * Deserialize this pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
LayerShapeFin.deserialize = function(buffer) {
    return new LayerShapeFin(
        buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
LayerShapeFin.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.roundness);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
LayerShapeFin.prototype.configure = function(gl, program) {
    gl.uniform1f(program["uRoundness"], this.SAMPLER_ROUNDNESS.sample(this.roundness / 0xFF));
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerShapeFin.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        ["roundness"]);
};