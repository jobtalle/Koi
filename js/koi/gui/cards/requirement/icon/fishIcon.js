/**
 * A fish icon
 * @param {HTMLElement} element The element to build the icon in
 * @param {PatternFootprint} [footprint] The footprint to create an icon for, if any
 * @constructor
 */
const FishIcon = function(element, footprint = null) {
    element.appendChild(this.createBackground());
    element.appendChild(this.createIcon(footprint));
};

FishIcon.prototype = Object.create(FishIconConstants.prototype);
FishIcon.prototype.WIDTH = 50;
FishIcon.prototype.HEIGHT = 130;

/**
 * Create the background image
 * @returns {SVGSVGElement} The SVG background
 */
FishIcon.prototype.createBackground = function() {
    const background = SVG.createElement();
    const rect = SVG.createRect(0, 0, this.BACKGROUND_RADIUS * 2, this.BACKGROUND_RADIUS * 2);

    SVG.setViewBox(background, 0, 0, this.BACKGROUND_RADIUS * 2, this.BACKGROUND_RADIUS * 2);
    SVG.setPreserveAspectRatio(background, "none");
    SVG.setPattern(rect, this.ID_BACKGROUND);

    background.appendChild(rect);

    return background;
};

/**
 * Create the fish icon
 * @param {PatternFootprint} [footprint] The footprint to create an icon for, if any
 * @returns {SVGSVGElement} The SVG icon
 */
FishIcon.prototype.createIcon = function(footprint) {
    const icon =  SVG.createElement();
    const layers = this.createLayers(footprint);

    SVG.setViewBox(icon, 0, 0, this.WIDTH, this.HEIGHT);

    SVG.setTransform(
        layers,
        (this.WIDTH - FishIconLayer.prototype.WIDTH) * .5,
        (this.HEIGHT - FishIconLayer.prototype.HEIGHT) * .5);
    SVG.setMask(layers, FishIconLayer.prototype.ID_MASK);

    icon.appendChild(layers);

    return icon;
};

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
                    new FishIconLayerBase(footprint.layers[layer].paletteIndex).addToGroup(group, layer);

                    break;
                case LayerSpots.prototype.ID:
                    new FishIconLayerSpots(footprint.layers[layer].paletteIndex).addToGroup(group, layer);

                    break;
                case LayerStripes.prototype.ID:
                    new FishIconLayerStripes(footprint.layers[layer].paletteIndex).addToGroup(group, layer);

                    break;
            }
        }
    }
    else
        new FishIconLayerWildcard().addToGroup(group);

    return group;
};