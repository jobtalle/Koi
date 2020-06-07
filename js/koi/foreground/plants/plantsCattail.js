Plants.prototype.CATTAIL_COLOR_STALK = Color.fromCSS("cattail-stalk");
Plants.prototype.CATTAIL_COLOR_CAPSULE = Color.fromCSS("cattail-capsule");

/**
 * Model cattail
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCattail = function(x, y, random, vertices, indices) {
    const uv = this.makeUV(x, y, random);
    const flex = .2;
    const flexPower = 2.5;
    const height = 2.2;
    const capsuleStart = 1.2;
    const capsuleEnd = 2;
    const leafStart = .3;
    const leafEnd = 1;
    const direction = Math.PI * .5 + (random.getFloat() - .5) * .1;
    const flexSampler = new Plants.FlexSampler(x, 0, flex, flexPower, height);
    const leafSet = new Plants.LeafSet(
        x + Math.cos(direction) * leafStart,
        Math.sin(direction) * leafStart,
        x + Math.cos(direction) * leafEnd,
        Math.sin(direction) * leafEnd,
        .2,
        .7,
        Math.PI * .5,
        .8,
        .35,
        .6,
        .2,
        random);

    this.modelCapsule(
        x + Math.cos(direction) * capsuleStart,
        Math.sin(direction) * capsuleStart,
        x + Math.cos(direction) * capsuleEnd,
        Math.sin(direction) * capsuleEnd,
        y,
        .1,
        uv,
        this.CATTAIL_COLOR_CAPSULE,
        .7,
        flexSampler,
        vertices,
        indices);

    this.modelStalk(
        x,
        0,
        x + Math.cos(direction) * height,
        Math.sin(direction) * height,
        y,
        .05,
        uv,
        this.CATTAIL_COLOR_STALK,
        .8,
        flexSampler,
        vertices,
        indices);

    leafSet.model(
        y,
        uv,
        this,
        flexSampler,
        random,
        vertices,
        indices);
};