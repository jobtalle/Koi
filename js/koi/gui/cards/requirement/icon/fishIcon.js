/**
 * A fish icon
 * @param {PatternFootprint} footprint The footprint to create an icon for
 * @constructor
 */
const FishIcon = function(footprint) {
    this.element = SVG.createElement(this.CLASS);

    SVG.setViewBox(this.element, 0, 0, this.WIDTH, this.HEIGHT);

    const group = SVG.createGroup();

    // TODO: Parse footprint here
    group.appendChild(new FishIconLayerColor(Palette.COLORS[2]).group);

    SVG.setTransform(
        group,
        (this.WIDTH - FishIconLayer.prototype.WIDTH) * .5,
        (this.HEIGHT - FishIconLayer.prototype.HEIGHT) * .5);

    this.element.appendChild(group);
};

FishIcon.prototype.CLASS = "fish-icon";
FishIcon.prototype.WIDTH = 130;
FishIcon.prototype.HEIGHT = 55;