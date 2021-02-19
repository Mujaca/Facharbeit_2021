// Initialize Game Objects
var pipes = [];
var living_player = [];
var all_player = [];
//Pipe Properties
var pipe = {
  spacing: 150,
  width: 80,
  speed: 5,
  spawn_rate: 75
}
//Check if a Loaded Player is playing
var loaded = false;
var loaded_brain = null;
var loaded_input;

//Setup the Generation Counter & Living Player Counter & Highscore Counter
var generation = 1;
var generation_span;
var living_span;
var highscore = 0;
var highscore_span;

// Set Game Speed in Ticks per Frame (tpf)
var game_tick = 0;
var tpf = 1;
// Setup Initial Population
var population = 100;

//Interface Elements
var tick_slider;
var tick_span;

var population_slider;
var population_span;

var spawnrate_slider;
var spawnrate_span;

var pipespeed_slider;
var pipespeed_span;

var pipespace_slider;
var pipespace_span;

var reset_button;
var save_button;

//Draw the Game Canvas
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent("game-wrapper")
    
    //Populate the Players
    for (let index = 0; index < population; index++) {
      living_player.push(new Player());
    }
    //Setup all_player for later use in the Genetic Algorithm 
    all_player = living_player.slice();

    //Access the Interface
    generation_span = select("#generation_span")
    living_span = select("#player_span")
    highscore_span = select("#highscore")

    tick_slider = select("#tps_slider");
    tick_span = select("#tps");

    population_slider = select("#population_slider")
    population_span = select("#population");
    population_slider.changed(restart_game)

    spawnrate_slider = select("#pipe_slider");
    spawnrate_span = select("#pipe");

    pipespeed_slider = select("#pipe_speed_slider");
    pipespeed_span = select("#pipe_speed")

    pipespace_slider = select("#pipe_spacing_slider");
    pipespace_span = select("#pipe_spacing");

    reset_button = select("#reset");
    reset_button.mousePressed(restart_game);

    save_button = select("#save");
    save_button.mousePressed(saveBest)

    loaded_input = createFileInput(loadPlayer);
    loaded_input.parent("#load")
  }
  
function draw() {
  //Make the Background Black
  background(0);

  //Update the Sliders & Span
  generation_span.html(generation);
  living_span.html(living_player.length);
  highscore_span.html(highscore)

  tpf = tick_slider.value();
  tick_span.html(tpf)

  pipe.speed = pipespeed_slider.value();
  pipespeed_span.html(pipe.speed);

  pipe.spacing = pipespace_slider.value();
  pipespace_span.html(pipe.spacing);

  pipe.spawn_rate =  spawnrate_slider.value();
  spawnrate_span.html(pipe.spawn_rate);

  // Execute the Game in the given tpf
  for (let tick = 0; tick < tpf; tick++) {
    //Pipe behavier
    pipes.forEach((pipe, index) => {
      pipe.show();
      pipe.update();
      //Delete the Pipe if its goes offscreen
      if(pipe.outside()) pipes.splice(index, 1);
    })
    //Player behavier
    living_player.forEach((player, index) => {
      player.update();
      player.show();
      //Let the Player think, what it should do
      player.think(pipes);
      //Check if the Player was hit by an Pipe -> delete the Player
      pipes.forEach((pipe) => {if(pipe.hit(player)) living_player.splice(index, 1); checkGeneration();});
    })
    //Spawn a new Pipe if the game_tick divided by the pipe spawn rate and refresh High Score
    if(game_tick % pipe.spawn_rate == 0) {pipes.push(new Pipe(pipe.spacing, pipe.width, pipe.speed)); getHighscore();}
    game_tick++;
  }
}

// Check if are any active player 
function checkGeneration(){
  if(living_player.length == 0){
    //Intialize the new Generation of Player
    loaded ? restart_game() : newGeneration();
  }
  return;
}
//Restart the Game if population was changed or the loaded player failed
function restart_game(){
  //Change the population Size based on the Slider
  population = population_slider.value();
  population_span.html(population)
  //Reset the pipes currently on the Screen
  pipes = [];
  
  //Reset all Player
  living_player = [];
  all_player = [];

  //Generate a new Population
  for (let index = 0; index < population; index++) {
    if(!loaded) living_player.push(new Player());
  }
  if(loaded) living_player.push(new Player(loaded_brain))
  //Reset the Generation Counter & Game Tick Counter
  generation = 1;
  game_tick = 0;
  //Setup all_player for later use in the Genetic Algorithm 
  all_player = living_player.slice();
}
// Refresh the Highscore
function getHighscore() {
  living_player.forEach((player) => {
    if(player.score > highscore) highscore = player.score;
  })
  return highscore;
}

//Save the best Player in an JSON File
function saveBest(){
  var bestplayer = living_player[0];
  living_player.forEach((player) => {
    if(player.score > bestplayer.score) bestplayer = player;
  })
  saveJSON(bestplayer.copy().brain, "player.json");
}
//Load the given player
function loadPlayer(event){
  loaded_brain = NeuralNetwork.deserialize(event.data);
  loaded = true;
}