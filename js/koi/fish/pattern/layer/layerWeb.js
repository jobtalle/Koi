/**
 * A web pattern
 * @param {Plane} plane The distortion sampling plane
 * @param {Number} paletteIndex A palette sample index
 * @param {Number} scale The web scale in the range [0, 255]
 * @param {Number} thickness The band thickness in the range [0, 255]
 * @param {Number} threshold The sample threshold in the range [0, 255]
 * @constructor
 */
const LayerWeb = function(
    plane,
    paletteIndex,
    scale,
    thickness,
    threshold) {
    this.plane = plane;
    this.scale = scale;
    this.thickness = thickness;
    this.threshold = threshold;

    Layer.call(this, this.ID, paletteIndex);
};

LayerWeb.prototype = Object.create(Layer.prototype);

LayerWeb.prototype.SAMPLER_SCALE = new SamplerPlateau(1.5, 3, 6.5, 1);
LayerWeb.prototype.SAMPLER_THICKNESS = new SamplerPlateau(.1, .15, .3, 2);
LayerWeb.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(.3, .5, .7, 1);

LayerWeb.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerWeb.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise3 + `
uniform lowp vec3 color;
uniform mediump float scale;
uniform mediump float thickness;
uniform mediump float threshold;
uniform mediump vec2 size;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;

void main() {
  highp vec2 at = (iUv - 0.5) * size * scale;
  mediump float noise = cubicNoise(anchor + vec3(at, 0.0) * rotate);
  
  if (noise < threshold - thickness * 0.5 || noise > threshold + thickness * 0.5)
    discard;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a web pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {LayerWeb} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerWeb.deserialize = function(buffer) {
    return new LayerWeb(
        Plane.deserialize(buffer),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerWeb.prototype.serialize = function(buffer) {
    this.plane.serialize(buffer);

    buffer.writeUint8(this.paletteIndex);
    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.thickness);
    buffer.writeUint8(this.threshold);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerWeb} A copy of this layer
 */
LayerWeb.prototype.copy = function() {
    return new LayerWeb(
        this.plane.copy(),
        this.paletteIndex,
        this.scale,
        this.thickness,
        this.threshold);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerWeb.prototype.configure = function(gl, program, color) {
    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform1f(program["uThickness"], this.SAMPLER_THICKNESS.sample(this.thickness / 0xFF));
    gl.uniform1f(program["uThreshold"], this.SAMPLER_THRESHOLD.sample(this.threshold / 0xFF));
    gl.uniform3f(program["uAnchor"], this.plane.anchor.x, this.plane.anchor.y, this.plane.anchor.z);
    gl.uniformMatrix3fv(program["uRotate"], false, this.plane.makeMatrix());
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerWeb.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        [
            "scale",
            "thickness",
            "threshold",
            "color",
            "anchor",
            "rotate",
            "size"
        ]);
};