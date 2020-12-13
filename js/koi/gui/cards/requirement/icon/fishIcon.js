/**
 * A fish icon
 * @param {PatternFootprint} [footprint] The footprint to create an icon for, if any
 * @constructor
 */
const FishIcon = function(footprint = null) {
    this.element = SVG.createElement();

    SVG.setViewBox(this.element, 0, 0, this.WIDTH, this.HEIGHT);

    const group = this.createLayers(footprint);

    SVG.setTransform(
        group,
        (this.WIDTH - FishIconLayer.prototype.WIDTH) * .5,
        (this.HEIGHT - FishIconLayer.prototype.HEIGHT) * .5);
    SVG.setMask(group, FishIconLayer.prototype.ID_MASK);

    this.element.appendChild(group);
};

FishIcon.prototype.WIDTH = 50;
FishIcon.prototype.HEIGHT = 150;

/**
 * Create the SVG group containing all layers
 * @param {PatternFootprint} footprint The footprint to create an icon for
 */
FishIcon.prototype.createLayers = function(footprint) {
    const group = SVG.createGroup();

    if (footprint) {
        for (let layer = 0, layerCount = footprint.layers.length; layer < layerCount; ++layer) {
            switch (footprint.layers[layer].id) {
                case LayerBase.prototype.ID:
                    group.appendChild(new FishIconLayerBase(footprint.layers[layer].paletteIndex).makeGroup(layer));

                    break;
                case LayerSpots.prototype.ID:
                    group.appendChild(new FishIconLayerSpots(footprint.layers[layer].paletteIndex).makeGroup(layer));

                    break;
            }
        }
    }
    else
        group.appendChild(new FishIconLayerWildcard().makeGroup());

    return group;
};