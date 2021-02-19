// The Mutate Function for the Neurol Network
function mutate(x) {
    if (random(1) < 0.1) {
      let offset = randomGaussian() * 0.5;
      let newx = x + offset;
      return newx;
    } else {
      return x;
    }
  }

class Player{
    constructor(brain){
        //Setup the Player with its x position, its y position and its hit Radius
        this.x = 128;
        this.y = height / 2;
        this.r = 12;
        //TODO make gravity changeable? 
        //Setup the gravity Force
        this.gravity = 0.8;
        this.lift = -12;
        this.velocity = 0;
        //Fitness is normalized
        this.fitness = 0;
        //Setup Score
        this.score = 0;
        //Create A new Brain with 5 Inputs, 8 Neurons in the Hidden Layer and 2 Outputs
        this.brain = new NeuralNetwork(5, 8, 2);
        //Load an existing brain if one is given and try to mutate it
        if(brain !== undefined && brain instanceof NeuralNetwork) {this.brain = brain.copy(); if(!loaded) this.brain.mutate(mutate)}
        
    }
    //Draw the player
    show(){
        var c = color(255,69,0)
        stroke(255);
        fill(c);
        ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
    //Accelerate the Player upwards
    up(){
        this.velocity += this.lift;
    }
    //Let the Bird think
    think(pipes) {
        let closest_pipe = null;
        let record = Infinity;

        pipes.forEach((pipe) => {
            var diff = pipe.x - this.x;
            if(diff > 0 && diff < record){ record = diff; closest_pipe = pipe; }
        })

        if(closest_pipe !== null){
            var inputs = [];
            //x position of pipe
            inputs[0] = map(closest_pipe.x, this.x, width, 0, 1);
            //y position of toppipe
            inputs[1] = map(closest_pipe.toppipe, 0, height, 0, 1);
            //y position of bottom pipe
            inputs[2] = map(closest_pipe.bottompipe, 0, height, 0, 1);
            //own y position
            inputs[3] = map(this.y, 0, height, 0, 1);
            //the current velocity
            inputs[4] = map(this.velocity, -10, 10, 0, 1);
            //Give the inputs in the Neurol Network and jump if the network says so
            var action = this.brain.predict(inputs);
            if(action[1] > action[0]) this.up();
        }
    }
    //Update the player
    update(){
        this.velocity += this.gravity;
        this.y += this.velocity;
        //Cap the Velocity at 10 pixel / frame up/downward
        this.velocity = constrain(this.velocity, -10, 10)
        //Give a Point to the player
        this.score++;
    }
    //copy the current player
    copy(){
        return new Player(this.brain);
    }
}