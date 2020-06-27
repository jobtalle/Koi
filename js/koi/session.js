/**
 * A session containing user data
 * @param {Random} random The gameplay randomizer
 * @param {Number} environmentSeed A 32 bit integer seed for environment generation
 * @constructor
 */
const Session = function(
    random = new Random(),
    environmentSeed = Random.prototype.makeSeed()) {
    this.random = random;
    this.environmentSeed = environmentSeed;
};

Session.prototype.deserialize = function() {

};

Session.prototype.serialize = function() {

};