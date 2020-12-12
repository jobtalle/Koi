/**
 * A fish icon
 * @param {PatternFootprint} footprint The footprint to create an icon for
 * @constructor
 */
const FishIcon = function(footprint) {
    this.element = SVG.createElement(this.CLASS);

    SVG.setViewBox(this.element, 0, 0, this.WIDTH, this.HEIGHT);

    const group = SVG.createGroup();

    for (const layer of footprint.layers) {
        switch (layer.id) {
            case LayerBase.prototype.ID:
                group.appendChild(new FishIconLayerColor(layer.paletteIndex).group);

                break;
        }
    }

    SVG.setTransform(
        group,
        (this.WIDTH - FishIconLayer.prototype.WIDTH) * .5,
        (this.HEIGHT - FishIconLayer.prototype.HEIGHT) * .5);

    this.element.appendChild(group);
};

FishIcon.prototype.CLASS = "fish-icon";
FishIcon.prototype.WIDTH = 50;
FishIcon.prototype.HEIGHT = 150;

/**
 *
 * @param group
 * @param footprint
 */
FishIcon.prototype.createLayers = function(group, footprint) {
    for (const layer of footprint.layers) {
        switch (layer.id) {
            case LayerBase.prototype.ID:
                group.appendChild(new FishIconLayerColor(layer.paletteIndex).group);

                break;
        }
    }
};