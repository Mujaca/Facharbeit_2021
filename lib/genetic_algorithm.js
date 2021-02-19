// Reset the Pipes and Game Ticks for the next generation
function reset(){
    game_tick = 0;
    pipes = [];
}

// Create the new Generation and let them play 
function newGeneration(){
    generation++;
    reset();
    normalize(all_player);
    living_player = generate(all_player);
    all_player = living_player.slice();
}
// Generate the next Generation
function generate(old_players){
    var new_players = [];
    old_players.forEach((player, index) => {
        new_players[index] = select_player(old_players);
    })
    return new_players;
}
//Create the normalized Fitness Value based on the Score
function normalize(players){
    let sums = 0;

    players.forEach((player, index) => {
        player.score = pow(player.score, 2);
        sums += player.score;
    })

    players.forEach((player) => { player.fitness = player.score / sums })
}
// Select Player for the next generation
function select_player(players) {
    var index = 0;
    var r = random(1);

    while(r > 0) {
        r -= players[index].fitness;
        index++;
    }
    return players[index - 1].copy();
}