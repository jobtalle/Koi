/**
 * A polygon
 * @param {Array} vectors An array of vectors
 * @param {Boolean} closed A boolean indicating whether this shape is closed
 * @constructor
 */
const Polygon = function(vectors, closed) {
    this.vectors = vectors;
    this.closed = closed;
};

/**
 * Render this polygon for debugging
 * @param {Renderer} renderer The renderer
 */
Polygon.prototype.render = function(renderer) {
    for (let i = 0; i < this.vectors.length - 1; ++i)
        renderer.drawLine(
            this.vectors[i].x,
            this.vectors[i].y,
            Color.WHITE,
            this.vectors[i + 1].x,
            this.vectors[i + 1].y,
            Color.WHITE);

    if (this.closed)
        renderer.drawLine(
            this.vectors[this.vectors.length - 1].x,
            this.vectors[this.vectors.length - 1].y,
            Color.WHITE,
            this.vectors[0].x,
            this.vectors[0].y,
            Color.WHITE);
};