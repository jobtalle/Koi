/**
 * A collection of shared shader code
 */
const CommonShaders = {};

// Randomizers
CommonShaders.random = `
uniform sampler2D noise;

mediump float random(highp vec3 x) {
    return texture2D(noise, x.xy * 37.41 + x.z * 43.47).r;
}
`;

// Cubic noise
CommonShaders.cubicNoise = CommonShaders.random + `
mediump float interpolate(mediump float a, mediump float b, mediump float c, mediump float d, mediump float x) {
  mediump float p = (d - c) - (a - b);

  return x * (x * (x * p + ((a - b) - p)) + (c - a)) + b;
}

mediump float sampleX(mediump vec3 at) {
  mediump float floored = floor(at.x);

  return interpolate(
      random(vec3(floored - 1.0, at.yz)),
      random(vec3(floored, at.yz)),
      random(vec3(floored + 1.0, at.yz)),
      random(vec3(floored + 2.0, at.yz)),
  at.x - floored) * 0.5 + 0.25;
}

mediump float sampleY(mediump vec3 at) {
  mediump float floored = floor(at.y);

  return interpolate(
      sampleX(vec3(at.x, floored - 1.0, at.z)),
      sampleX(vec3(at.x, floored, at.z)),
      sampleX(vec3(at.x, floored + 1.0, at.z)),
      sampleX(vec3(at.x, floored + 2.0, at.z)),
      at.y - floored);
}

mediump float cubicNoise(mediump vec3 at) {
  mediump float floored = floor(at.z);

  return interpolate(
      sampleY(vec3(at.xy, floored - 1.0)),
      sampleY(vec3(at.xy, floored)),
      sampleY(vec3(at.xy, floored + 1.0)),
      sampleY(vec3(at.xy, floored + 2.0)),
      at.z - floored);
}
`;