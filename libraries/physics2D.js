class Object2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speedX;
        this.speedY;
        this.accelX;
        this.accelY;
        this.mass;
        this.forceX;
        this.forceY;
    }
    update() {
        this.accelX = this.forceX / this.mass;
        this.accelY = this.forceY / this.mass;
        this.speedX += this.accelX/60;  // frame update is after 1/60s
        this.speedY += this.accelY/60;
        this.x += this.speedX/60;
        this.y += this.speedY/60;

        return this;
    }
    draw(context=ctx) {
        return this;
    }
    resolveCollideWall(context=ctx){
        
    }
}