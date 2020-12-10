/**
 * A fish icon color layer
 * @param {Color} color The color
 * @constructor
 */
const FishIconLayerColor = function(color) {
    this.color = color;

    FishIconLayer.call(this);
};

FishIconLayerColor.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerColor.prototype.draw = function(group) {
    const body = this.createBodyPath(this.WIDTH, this.HEIGHT);

    SVG.setFill(body, this.color.toHex());

    group.appendChild(body);
};