/**
 * A pond shape from which fish cannot escape
 * @param {Polygon} polygon The shape of this pond, which must be a closed polygon
 * @constructor
 */
const Pond = function(polygon) {
    this.polygon = polygon;
};