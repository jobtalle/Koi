/**
 * A fish preview animation maker
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Preview = function(gl) {
    this.target = new RenderTarget(gl, this.PREVIEW_WIDTH, this.PREVIEW_HEIGHT, gl.RGBA, false);
};

Preview.prototype.PREVIEW_WIDTH = StyleUtils.getInt("--card-preview-width");
Preview.prototype.PREVIEW_HEIGHT = StyleUtils.getInt("--card-preview-height");

/**
 * Render a fish preview to a canvas
 * @param {FishBody} body The fish body to render
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 */
Preview.prototype.render = function(body, atlas, bodies) {
    // TODO: Return image element
};

/**
 * Free all data maintained by the preview renderer
 */
Preview.prototype.free = function() {
    this.target.free();
};