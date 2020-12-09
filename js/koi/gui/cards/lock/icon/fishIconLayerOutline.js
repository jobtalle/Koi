/**
 * A fish icon outline layer
 * @constructor
 */
const FishIconLayerOutline = function() {
    FishIconLayer.call(this);
};

FishIconLayerOutline.prototype = Object.create(FishIconLayer.prototype);

/**
 * Draw this icons parts inside its group
 * @param {SVGGElement} group The group to draw in
 */
FishIconLayerOutline.prototype.draw = function(group) {
    const contents = SVG.createGroup();

    contents.appendChild(SVG.createCircle(
        this.EYE_X,
        this.HEIGHT * .5 - this.EYE_Y,
        this.EYE_RADIUS,
        this.CLASS_FILL));
    contents.appendChild(SVG.createCircle(
        this.EYE_X,
        this.HEIGHT * .5 + this.EYE_Y,
        this.EYE_RADIUS,
        this.CLASS_FILL));

    SVG.setMask(contents, this.ID_MASK);

    group.appendChild(contents);
    group.appendChild(this.createBodyPath(this.WIDTH, this.HEIGHT, this.CLASS_OUTLINE));
};