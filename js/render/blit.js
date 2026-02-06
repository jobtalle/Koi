/**
 * A system containing a simple texture rendering shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Blit = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position"],
        []);
};

/**
 * Free this system
 */
Blit.prototype.free = function() {
    this.program.free();
};

Blit.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = position * 0.5 + 0.5;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Blit.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;

varying highp vec2 iUv;

void main() {
  gl_FragColor = texture2D(source, iUv);
}
`;