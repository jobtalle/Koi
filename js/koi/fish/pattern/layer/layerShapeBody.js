/**
 * A fish body shape which will be superimposed over a pattern
 * @param {Number} centerPower A power value that shifts the center of the fish thickness in the range [0, 255]
 * @param {Number} radiusPower A power value to apply to the body radius in the range [0, 255]
 * @param {Number} eyePosition The eye position in the range [0, 255]
 * @constructor
 */
const LayerShapeBody = function(centerPower, radiusPower, eyePosition) {
    this.centerPower = centerPower;
    this.radiusPower = radiusPower;
    this.eyePosition = eyePosition;

    Layer.call(this);
};

LayerShapeBody.prototype = Object.create(Layer.prototype);

LayerShapeBody.prototype.SHADE_POWER = 1.65;
LayerShapeBody.prototype.LIGHT_POWER = 0.7;
LayerShapeBody.prototype.AMBIENT = 0.44;
LayerShapeBody.prototype.SAMPLER_CENTER_POWER = new SamplerPlateau(.5, .6, 1, 1.2);
LayerShapeBody.prototype.SAMPLER_RADIUS_POWER = new SamplerPlateau(.6, .7, 1.2, .7);
LayerShapeBody.prototype.SAMPLER_EYE_POSITION = new Sampler(.07, .115);
LayerShapeBody.prototype.COLOR_SHADE = Color.fromCSS("--color-fish-shade");

LayerShapeBody.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerShapeBody.prototype.SHADER_FRAGMENT = `#version 100
uniform highp float centerPower;
uniform highp float radiusPower;
uniform highp float eyePosition;
uniform highp float shadePower;
uniform highp float lightPower;
uniform highp float ambient;
uniform highp vec2 size;
uniform lowp vec3 shadeColor;

varying highp vec2 iUv;

#define EYE_SHADE_PUPIL 0.2
#define EYE_RADIUS_PUPIL 0.1

highp float getRadius(highp float x) {
  return pow(cos(3.141592 * (pow(x, centerPower) - 0.5)), radiusPower);
}

void main() {
  lowp float radius = 2.0 * abs(iUv.y - 0.5);
  lowp float edge = getRadius(iUv.x);
  
  if (radius > edge)
    gl_FragColor = vec4(0.0);
  else {
    lowp float shade = pow(max(0.0, 1.0 - pow(radius / edge, shadePower)), lightPower);
    lowp float eyeY = 0.5 * getRadius(eyePosition);
    lowp float eyeDist = min(
      length((vec2(eyePosition, 0.5 + eyeY) - iUv) * size),
      length((vec2(eyePosition, 0.5 - eyeY) - iUv) * size));
    
    if (eyeDist < EYE_RADIUS_PUPIL)
      gl_FragColor = vec4(vec3(EYE_SHADE_PUPIL), 1.0);
    else
      gl_FragColor = vec4(mix(shadeColor, vec3(1.0 - ambient), shade) + ambient, 1.0);
  }
}
`;

/**
 * Deserialize this pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {LayerShapeBody} The deserialized pattern shape
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerShapeBody.deserialize = function(buffer) {
    return new LayerShapeBody(buffer.readUint8(), buffer.readUint8(), buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerShapeBody.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.centerPower);
    buffer.writeUint8(this.radiusPower);
    buffer.writeUint8(this.eyePosition);
};

/**
 * Sample the shapeBody thickness ratio
 * @param {Number} x The X position to sample at in the range [0, 1]
 * @returns {Number} The thickness in the range [0, 1]
 */
LayerShapeBody.prototype.sample = function(x) {
    const centerPower = this.SAMPLER_CENTER_POWER.sample(this.centerPower / 0xFF);
    const radiusPower = this.SAMPLER_RADIUS_POWER.sample(this.radiusPower / 0xFF);

    return Math.pow(Math.cos(Math.PI * (Math.pow(x, centerPower) - .5)), radiusPower);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
LayerShapeBody.prototype.configure = function(gl, program) {
    gl.uniform1f(program["uCenterPower"], this.SAMPLER_CENTER_POWER.sample(this.centerPower / 0xFF));
    gl.uniform1f(program["uRadiusPower"], this.SAMPLER_RADIUS_POWER.sample(this.radiusPower / 0xFF));
    gl.uniform1f(program["uEyePosition"], this.SAMPLER_EYE_POSITION.sample(this.eyePosition / 0xFF));
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerShapeBody.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        ["centerPower", "radiusPower", "eyePosition", "size"],
        [
            new Shader.Constant("shadePower", "f", [this.SHADE_POWER]),
            new Shader.Constant("lightPower", "f", [this.LIGHT_POWER]),
            new Shader.Constant("ambient", "f", [this.AMBIENT]),
            new Shader.Constant("shadeColor", "f", this.COLOR_SHADE.toArrayRGB())
        ]);
};