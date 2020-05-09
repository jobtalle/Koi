/**
 * A fish shape which will be superimposed over a pattern
 * @param {Number} centerPower A power value that shifts the center of the fish thickness
 * @param {Number} radiusPower A power value to apply to the body radius
 * @constructor
 */
const PatternShape = function(centerPower, radiusPower) {
    this.centerPower = centerPower;
    this.radiusPower = radiusPower;
};

PatternShape.prototype.SHADE_POWER = 1.8;
PatternShape.prototype.LIGHT_POWER = 0.4;

PatternShape.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

PatternShape.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump float centerPower;
uniform mediump float shadePower;
uniform mediump float lightPower;
uniform mediump float radiusPower;

varying mediump vec2 iUv;

void main() {
  mediump float radius = 2.0 * abs(iUv.y - 0.5);
  mediump float edge = pow(cos(3.141592 * (pow(iUv.x, centerPower) - 0.5)), radiusPower);
  
  if (radius > edge)
    gl_FragColor = vec4(0.0);
  else
    gl_FragColor = vec4(vec3(pow(max(0.0, 1.0 - pow(radius / edge, shadePower)), lightPower)), 1.0);
}
`;

/**
 * Sample the shape thickness ratio
 * @param {Number} x The X position to sample at in the range [0, 1]
 * @returns {Number} The thickness in the range [0, 1]
 */
PatternShape.prototype.sample = function(x) {
    return Math.pow(Math.cos(Math.PI * (Math.pow(x, this.centerPower) - 0.5)), this.radiusPower);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
PatternShape.prototype.configure = function(gl, program) {
    gl.uniform1f(program.uCenterPower, this.centerPower);
    gl.uniform1f(program.uShadePower, this.SHADE_POWER);
    gl.uniform1f(program.uLightPower, this.LIGHT_POWER);
    gl.uniform1f(program.uRadiusPower, this.radiusPower);
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
PatternShape.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["centerPower", "shadePower", "lightPower", "radiusPower"],
        ["position", "uv"]);
};