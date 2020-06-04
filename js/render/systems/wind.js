/**
 * The wind system
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Quad} quad A quad renderer
 * @constructor
 */
const Wind = function(gl, quad) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["spring", "damping"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);

    gl.enableVertexAttribArray(this.program.aPosition);
    gl.vertexAttribPointer(this.program.aPosition, 2, gl.FLOAT, false, 8, 0);
};

Wind.prototype.SPRING = .6;
Wind.prototype.DAMPING = .92;

Wind.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying mediump vec2 iUv;

void main() {
  iUv = position * 0.5 + 0.5;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Wind.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump float spring;
uniform mediump float damping;

varying mediump vec2 iUv;

void main() {
  lowp vec3 previous = texture2D(source, iUv).rgb;
  mediump float previousState = previous.r * 2.0 - 1.0;
  mediump float previousLeft = previous.g;
  mediump float previousRight = previous.b;
  mediump float motion = previousRight - previousLeft;
  mediump float state = previousState + motion * 0.2;
  
  motion = (motion - state * spring) * damping;
  
  if (motion < 0.0)
    gl_FragColor = vec4(state * 0.5 + 0.5, -motion, 0.0, 1.0);
  else
    gl_FragColor = vec4(state * 0.5 + 0.5, 0.0, motion, 1.0);
}
`;

/**
 * Propagate air influences over an air plane
 * @param {Air} air The air
 * @param {InfluencePainter} influencePainter The wind painter
 */
Wind.prototype.propagate = function(air, influencePainter) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    air.flip();
    air.getFront().target();

    this.gl.uniform1f(this.program["uSpring"], this.SPRING);
    this.gl.uniform1f(this.program["uDamping"], this.DAMPING);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, air.getBack().texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    influencePainter.applyInfluences(air.influences);
};

/**
 * Free the wind system
 */
Wind.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};