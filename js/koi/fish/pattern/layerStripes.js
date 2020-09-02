/**
 * A stripes pattern
 * @param {Plane} plane The distortion sampling plane
 * @param {Palette.Sample} sample A palette sample
 * @param {Number} scale The stripe scale in the range [0, 255]
 * @param {Number} distortion The stripe distortion in the range [0, 255]
 * @param {Number} roughness The stripe distortion frequency in the range [0, 255]
 * @param {Number} threshold The stripe threshold in the range [0, 255]
 * @param {Number} slant The pattern slant in the range [0, 255]
 * @param {Number} suppression The stripe suppression near the edges in the range [0, 255]
 * @param {Number} focus The stripes pattern focus along the spine of the fish in the range [0, 255]
 * @param {Number} power The power of the pattern near the focal point in the range [0, 255]
 * @constructor
 */
const LayerStripes = function(
    plane,
    sample,
    scale,
    distortion,
    roughness,
    threshold,
    slant,
    suppression,
    focus,
    power) {
    this.plane = plane;
    this.sample = sample;
    this.scale = scale;
    this.distortion = distortion;
    this.roughness = roughness;
    this.threshold = threshold;
    this.slant = slant;
    this.suppression = suppression;
    this.focus = focus;
    this.power = power;

    Layer.call(this, this.ID, sample, true, false, false, this.DOMINANCE);
};

LayerStripes.prototype = Object.create(Layer.prototype);

LayerStripes.prototype.DOMINANCE = .9;
LayerStripes.prototype.SAMPLER_SCALE = new SamplerPlateau(2.8, 4.3, 8.5, 5);
LayerStripes.prototype.SAMPLER_DISTORTION = new SamplerPlateau(3, 7, 12, 4);
LayerStripes.prototype.SAMPLER_ROUGHNESS = new Sampler(2, 4.3);
LayerStripes.prototype.SAMPLER_THRESHOLD = new SamplerSigmoid(.4, .6, 1);
LayerStripes.prototype.SAMPLER_SLANT = new SamplerPower(0, 1.6, 10);
LayerStripes.prototype.SAMPLER_SUPPRESSION = new SamplerPower(0.3, 2, 2);
LayerStripes.prototype.SAMPLER_FOCUS = new SamplerPlateau(0, 0.3, 1, 3);
LayerStripes.prototype.SAMPLER_POWER = new SamplerPower(.4, .6, 10);

LayerStripes.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerStripes.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise3 + `
uniform lowp vec3 color;
uniform mediump float scale;
uniform mediump float distortion;
uniform mediump float roughness;
uniform mediump float threshold;
uniform mediump float slant;
uniform mediump float suppression;
uniform mediump float focus;
uniform mediump float power;
uniform mediump vec2 size;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;

void main() {
  highp vec2 at = (iUv - 0.5) * size * roughness;
  mediump float dx = cubicNoise(anchor + vec3(at, 0.0) * rotate);
  mediump float dy = 2.0 * abs(iUv.y - 0.5);
  mediump float x = 2.0 * scale * iUv.x + dx * distortion / scale - dy * dy * slant;
  mediump float strength = pow(max(0.0, 1.0 - 2.0 * abs(iUv.x - focus)), power);
  
  if (min(mod(x, 2.0), 2.0 - mod(x, 2.0)) + dy * dy * suppression > threshold * strength)
    discard;

  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a stripes pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {LayerStripes} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerStripes.deserialize = function(buffer) {
    return new LayerStripes(
        Plane.deserialize(buffer),
        Palette.Sample.deserialize(buffer),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerStripes.prototype.serialize = function(buffer) {
    this.plane.serialize(buffer);
    this.sample.serialize(buffer);

    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.distortion);
    buffer.writeUint8(this.roughness);
    buffer.writeUint8(this.threshold);
    buffer.writeUint8(this.slant);
    buffer.writeUint8(this.suppression);
    buffer.writeUint8(this.focus);
    buffer.writeUint8(this.power);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerStripes} A copy of this layer
 */
LayerStripes.prototype.copy = function() {
    return new LayerStripes(
        this.plane.copy(),
        this.sample.copy(),
        this.scale,
        this.distortion,
        this.roughness,
        this.threshold,
        this.slant,
        this.suppression,
        this.focus,
        this.power);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerStripes.prototype.configure = function(gl, program, color) {
    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform1f(program["uDistortion"], this.SAMPLER_DISTORTION.sample(this.distortion / 0xFF));
    gl.uniform1f(program["uRoughness"], this.SAMPLER_ROUGHNESS.sample(this.roughness / 0xFF));
    gl.uniform1f(program["uThreshold"], this.SAMPLER_THRESHOLD.sample(this.threshold / 0xFF));
    gl.uniform1f(program["uSlant"], this.SAMPLER_SLANT.sample(this.slant / 0xFF));
    gl.uniform1f(program["uSuppression"], this.SAMPLER_SUPPRESSION.sample(this.suppression / 0xFF));
    gl.uniform1f(program["uFocus"], this.SAMPLER_FOCUS.sample(this.focus / 0xFF));
    gl.uniform1f(program["uPower"], this.SAMPLER_POWER.sample(this.power / 0xFF));
    gl.uniform3f(program["uAnchor"], this.plane.anchor.x, this.plane.anchor.y, this.plane.anchor.z);
    gl.uniformMatrix3fv(program["uRotate"], false, this.plane.makeMatrix());
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerStripes.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        [
            "scale",
            "distortion",
            "roughness",
            "threshold",
            "slant",
            "suppression",
            "color",
            "anchor",
            "rotate",
            "size",
            "focus",
            "power"
        ]);
};