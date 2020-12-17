/**
 * A mesh normalizer which normalizes vertex coordinates to clip space
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Number} stride The vertex stride
 * @param {Number[]} xClip Element offsets to transform to x clip space
 * @param {Number[]} yClip Element offsets to transform to y clip space
 * @param {Number[]} [xScale] Element offsets to transform to x clip scale
 * @param {Number[]} [yScale] Element offsets to transform to y clip scale
 * @param {Number[]} [xUv] Element offsets to transform to x uv space
 * @param {Number[]} [yUv] Element offsets to transform to y uv space
 * @constructor
 */
const MeshNormalizer = function(
    width,
    height,
    stride,
    xClip,
    yClip,
    xScale = null,
    yScale= null,
    xUv = null,
    yUv = null) {
    this.width = width;
    this.height = height;
    this.stride = stride;
    this.indices = [];

    for (const index of xClip)
        this.indices.push(index | this.INDEX_FLAG_CLIP_SPACE_X);

    for (const index of yClip)
        this.indices.push(index | this.INDEX_FLAG_CLIP_SPACE_Y);

    if (xScale) for (const index of xScale)
        this.indices.push(index | this.INDEX_FLAG_CLIP_SCALE_X);

    if (yScale) for (const index of yScale)
        this.indices.push(index | this.INDEX_FLAG_CLIP_SCALE_Y);

    if (xUv) for (const index of xUv)
        this.indices.push(index | this.INDEX_FLAG_UV_X);

    if (yUv) for (const index of yUv)
        this.indices.push(index | this.INDEX_FLAG_UV_Y);

    this.indices.sort((a, b) => (a & 0x00FF) - (b & 0x00FF));
};

MeshNormalizer.prototype.INDEX_FLAG_CLIP_SPACE_X = 0x0100;
MeshNormalizer.prototype.INDEX_FLAG_CLIP_SPACE_Y = 0x0200;
MeshNormalizer.prototype.INDEX_FLAG_CLIP_SCALE_X = 0x0400;
MeshNormalizer.prototype.INDEX_FLAG_CLIP_SCALE_Y = 0x0800;
MeshNormalizer.prototype.INDEX_FLAG_UV_X = 0x1000;
MeshNormalizer.prototype.INDEX_FLAG_UV_Y = 0x2000;

/**
 * Apply this mesh normalizer to vertex data
 * @param {Number[]} vertices Vertex data
 */
MeshNormalizer.prototype.apply = function(vertices) {
    const lastVertex = vertices.length;
    const scx = 2 / this.width;
    const scy = -2 / this.height;
    const su = 1 / this.width;
    const sv = 1 / this.height;

    for (let vertex = 0; vertex < lastVertex; vertex += this.stride) for (const index of this.indices) {
        const offset = index & 0xFF;

        switch (index & 0xFF00) {
            case this.INDEX_FLAG_CLIP_SPACE_X:
                vertices[vertex + offset] = vertices[vertex + offset] * scx - 1;

                break;
            case this.INDEX_FLAG_CLIP_SPACE_Y:
                vertices[vertex + offset] = vertices[vertex + offset] * scy + 1;

                break;
            case this.INDEX_FLAG_CLIP_SCALE_X:
                vertices[vertex + offset] = vertices[vertex + offset] * scx;

                break;
            case this.INDEX_FLAG_CLIP_SCALE_Y:
                vertices[vertex + offset] = vertices[vertex + offset] * scy;

                break;
            case this.INDEX_FLAG_UV_X:
                vertices[vertex + offset] *= su;

                break;
            case this.INDEX_FLAG_UV_Y:
                vertices[vertex + offset] = 1 - vertices[vertex + offset] * sv;

                break;
        }
    }
};