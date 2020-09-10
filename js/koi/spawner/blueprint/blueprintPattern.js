/**
 * A blueprint for a random pattern
 * @constructor
 */
const BlueprintPattern = function() {

};

/**
 * Spawn a pattern based on this blueprint
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Pattern} A pattern
 */
BlueprintPattern.prototype.spawn = function(
    atlas,
    patterns,
    randomSource,
    random) {
    // TODO: implement
    const pattern = new Pattern(
        new LayerBase(new Palette.Sample().randomize(random)),
        [
            new LayerSpots(
                new Plane(
                    new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
                    new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
                new Palette.Sample().randomize(random),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF),
                Math.round(random.getFloat() * 0xFF)
            ),
            // new LayerStripes(
            //     new Plane(
            //         new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
            //         new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
            //     new Palette.Sample().randomize(random),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF)
            // ),
            // new LayerRidge(
            //     new Plane(
            //         new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
            //         new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
            //     new Palette.Sample().randomize(random),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF)
            // ),
            // new LayerSpots(
            //     new Plane(
            //         new Vector3(random.getFloat() * 64, random.getFloat() * 64, random.getFloat() * 64),
            //         new Vector3(random.getFloat() - .5, random.getFloat() - .5, random.getFloat() - .5).normalize()),
            //     new Palette.Sample().randomize(random),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF),
            //     Math.round(random.getFloat() * 0xFF)
            // ),
        ],
        new LayerShapeBody(
            Math.round(random.getFloat() * 0xFF),
            Math.round(random.getFloat() * 0xFF),
            Math.round(random.getFloat() * 0xFF)),
        new LayerShapeFin());

    pattern.trim(patterns.palettes.base);
    atlas.write(pattern, randomSource);

    return pattern;
};