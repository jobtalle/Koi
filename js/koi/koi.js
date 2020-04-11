const Koi = function(renderer) {
    this.renderer = renderer;
    this.sprite = new Sprite("fish", new Vector(.5, .5));
};

Koi.prototype.UPDATE_RATE = 40;

Koi.prototype.update = function(timeStep) {

};

Koi.prototype.render = function() {
    this.renderer.clear();
    this.renderer.drawLine(0, 0, Color.WHITE, this.renderer.getWidth(), this.renderer.getHeight(), Color.WHITE);
    this.renderer.drawSprite(this.sprite, 300, 300);
    this.renderer.flush();
};