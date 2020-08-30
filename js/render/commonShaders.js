/**
 * A collection of shared shader code
 */
const CommonShaders = {};

// Randomizers
CommonShaders.random = `
uniform sampler2D noise;

mediump float random2(mediump vec2 x) {
  return texture2D(noise, x * 0.011).r;
}

mediump float random3(mediump vec3 x) {
  return texture2D(noise, x.xy * 0.011 - x.z * 0.017).r;
}
`;

// Cubic interpolation
CommonShaders.cubicInterpolation = `
mediump float interpolate(mediump float a, mediump float b, mediump float c, mediump float d, mediump float x) {
  mediump float p = (d - c) - (a - b);

  return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
}
`;

// 2D cubic noise
CommonShaders.cubicNoise2 = CommonShaders.random + CommonShaders.cubicInterpolation + `
mediump float sampleX(highp vec2 at) {
  highp float floored = floor(at.x);

  return interpolate(
    random2(vec2(floored - 1.0, at.y)),
    random2(vec2(floored, at.y)),
    random2(vec2(floored + 1.0, at.y)),
    random2(vec2(floored + 2.0, at.y)),
    at.x - floored) * 0.5 + 0.25;
}

mediump float cubicNoise(highp vec2 at) {
  highp float floored = floor(at.y);

  return interpolate(
    sampleX(vec2(at.x, floored - 1.0)),
    sampleX(vec2(at.x, floored)),
    sampleX(vec2(at.x, floored + 1.0)),
    sampleX(vec2(at.x, floored + 2.0)),
    at.y - floored);
}
`;

// 3D cubic noise
CommonShaders.cubicNoise3 = CommonShaders.random + CommonShaders.cubicInterpolation + `
mediump float sampleX(highp vec3 at) {
  highp float floored = floor(at.x);

  return interpolate(
    random3(vec3(floored - 1.0, at.yz)),
    random3(vec3(floored, at.yz)),
    random3(vec3(floored + 1.0, at.yz)),
    random3(vec3(floored + 2.0, at.yz)),
    at.x - floored) * 0.5 + 0.25;
}

mediump float sampleY(highp vec3 at) {
  highp float floored = floor(at.y);

  return interpolate(
    sampleX(vec3(at.x, floored - 1.0, at.z)),
    sampleX(vec3(at.x, floored, at.z)),
    sampleX(vec3(at.x, floored + 1.0, at.z)),
    sampleX(vec3(at.x, floored + 2.0, at.z)),
    at.y - floored);
}

mediump float cubicNoise(highp vec3 at) {
  highp float floored = floor(at.z);

  return interpolate(
    sampleY(vec3(at.xy, floored - 1.0)),
    sampleY(vec3(at.xy, floored)),
    sampleY(vec3(at.xy, floored + 1.0)),
    sampleY(vec3(at.xy, floored + 2.0)),
    at.z - floored);
}
`;