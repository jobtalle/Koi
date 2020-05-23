/**
 * The rocky terrain surrounding the ponds
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 * @constructor
 */
const Rocks = function(gl, constellation, random) {
    this.mesh = this.createMesh(gl, constellation, random);
};

/**
 * Create the rocks mesh
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @param {Random} random A randomizer
 */
Rocks.prototype.createMesh = function(gl, constellation, random) {
    const vertices = [];
    const indices = [];

    const triangulation = this.createTriangulation(constellation, random);

    for (const cell of triangulation) {
        let touchesLand = false;
        let inConstraint = null;

        for (const point of cell) {
            const constraint = constellation.contains(point.x, point.y);

            if (constraint) {
                if (!inConstraint)
                    inConstraint = constraint;
                else if (constraint !== inConstraint)
                    touchesLand = true;
            }
            else {
                touchesLand = true;

                break;
            }
        }

        if (!touchesLand)
            continue;

        const firstIndex = vertices.length / 5;
        const lightness = .3 + .3 * random.getFloat();
        const color = new Color(lightness, lightness, lightness);

        for (let point = 0; point < cell.length; ++point) {
            vertices.push(
                color.r,
                color.g,
                color.b,
                cell[point].x,
                cell[point].y);

            if (point > 1)
                indices.push(
                    firstIndex,
                    firstIndex + point - 1,
                    firstIndex + point);
        }
    }

    return new Mesh(gl, vertices, indices);
};

/**
 * Create a triangulation of the constellation
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 */
Rocks.prototype.createTriangulation = function(constellation, random) {
    const points = [];

    for (let i = 0; i < 1000; ++i)
        points.push(new Vector2(constellation.width * random.getFloat(), constellation.height * random.getFloat()));

    const triangulation = new Voronoi().compute(
        points,
        {
            xl: 0,
            xr: constellation.width,
            yt: 0,
            yb: constellation.height
        });

    const cells = [];

    for (const cell of triangulation.cells) if (!cell.closeMe) {
        const shape = [cell.halfedges[0].getStartpoint()];

        for (let edge = 0, edgeCount = cell.halfedges.length; edge < edgeCount; ++edge)
            shape.push(cell.halfedges[edge].getEndpoint());

        cells.push(shape);
    }

    return cells;
};

/**
 * Render the rocks
 * @param {Stone} stone The stone renderer
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Rocks.prototype.render = function(stone, width, height, scale) {
    stone.render(width, height, scale);
};

/**
 * Free all resources maintained by this object
 */
Rocks.prototype.free = function() {
    this.mesh.free();
};