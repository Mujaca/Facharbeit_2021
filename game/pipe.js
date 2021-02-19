class Pipe {
    constructor(spacing, lwidth, speed) {
        //Check if Spacing, local width (lwidth) and speed is defined.
        //If there not defined set Default Values
        this.spacing = spacing;
        if(isNaN(spacing)) this.spacing = 100;
        //Set the Center of the Pipe
        this.center = random(this.spacing, height - this.spacing);

        this.width = lwidth;
        if(isNaN(lwidth)) this.width = 80;

        this.speed = speed;
        if(isNaN(speed)) this.speed = 5;

        this.x  = width;
        //Generate the Coordinates of the top and bottom pipe
        this.toppipe = this.center - this.spacing / 2;
        this.bottompipe = height - (this.center + this.spacing / 2);
    }
    //Update the Pipe 
    update(){
        this.x -= this.speed;
    }
    //Draw the Top and bottom Pipe
    show() {
        stroke(255);
        fill(34,139,34);
        rect(this.x, 0, this.width, this.toppipe);
        rect(this.x, height - this.bottompipe , this.width, this.bottompipe);
    }
    //Returns if the pipe is outside the window
    outside() {
        return this.x < -this.width;
    }
    //Check if the given player is colliding with the pipe OR hitting the top or bottom of the canvas
    hit(player){
        return (player.y - player.r) < this.toppipe || (player.y + player.r) > (height - this.bottompipe) ? player.x > this.x && player.x < this.x + this.width ? true : player.y > height || player.y < 0 ? true : false : false
    }
}