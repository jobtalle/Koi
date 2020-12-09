/**
 * A fish icon
 * @param {FishIconLayer[]} [layers] Decoration layers for this fish icon
 * @constructor
 */
const FishIcon = function(layers = []) {
    this.element = SVG.createElement(this.WIDTH, this.HEIGHT, this.CLASS);

    const group = SVG.createGroup();

    for (const layer of layers)
        group.appendChild(layer.group);

    SVG.setTransform(
        group,
        (this.WIDTH - FishIconLayer.prototype.WIDTH) * .5,
        (this.HEIGHT - FishIconLayer.prototype.HEIGHT) * .5);

    this.element.appendChild(group);
};

FishIcon.prototype.CLASS = "fish-icon";
FishIcon.prototype.WIDTH = 160;
FishIcon.prototype.HEIGHT = 55;