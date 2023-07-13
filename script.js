//get context
/** @type {HTMLCanvasElement} */
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d")


//define the size for each game block - minding the canvas's aspect ratio so the blocks will cover the entire thing
const gridWidth = 34;
Block.width = canvas.width / gridWidth;
Block.ratio = canvas.getBoundingClientRect().width / canvas.getBoundingClientRect().height
const gridHeight = ~~(gridWidth / 1.7);

//defined game settings & info
const game = {
    /** @type {Number} defines the speed for each game update */
    speed: 1,
    /** @type {Number} each time eating an apple modify the speed by this amount */
    speedModifier: 0.991,
    /** @type {Number} current player's score */
    score: 0,
    /** @type {[Number,Number]} movment vector of the player */
    playerDirection: [1, 0],
    /** @type {Boolean} toggles bonus task - can pass throw walls */
    toggleWalls: false,
    /** @type {Boolean} toggles bonus task - can pass throw walls */
    isRunning: false,
    /** @type {Block[]} */
    snake: [],
    /** @type {Block} */
    apple: []
}

/**
 * Triggers the game start
 * @param {HTMLButtonElement} btn 
 */
function startGame() {

    document.querySelector(".startBtn").classList.remove("glowup");
    //if already running - exit
    if (game.isRunning)
        return;

    resetGame();
    gameLoop();
}

/**
 * reset game to defaulted values
 */
function resetGame() {
    game.isRunning = true;
    game.speed = 1;
    game.score = 0;
    game.playerDirection = [1, 0];
    game.snake = [new Block(~~(gridWidth / 2), ~~(gridHeight / 2))];
    generateApple();
}

let directionLock = false;
window.addEventListener("keydown", (e) => {
    //when right press & older movement is up/down
    if (e.key == "ArrowRight" && game.playerDirection[0] == 0 && !directionLock) {
        game.playerDirection = [1, 0]
        directionLock = true
    }

    //when left press & older movement is up/down
    if (e.key == "ArrowLeft" && game.playerDirection[0] == 0 && !directionLock) {
        game.playerDirection = [-1, 0]
        directionLock = true
    }

    //when up press & older movement is left/right
    if (e.key == "ArrowUp" && game.playerDirection[1] == 0 && !directionLock) {

        game.playerDirection = [0, -1]
        directionLock = true
    }

    //when up press & older movement is left/right
    if (e.key == "ArrowDown" && game.playerDirection[1] == 0 && !directionLock) {
        game.playerDirection = [0, 1]
        directionLock = true
    }

    if (e.key == " ")
        startGame();

})

/**
 * basic game loop, calcs & render staff
 */
function gameLoop() {
    //if the game is not running - exit.
    if (!game.isRunning)
        return;

    //run game update
    gameUpdate();

    //draw all game comp
    drawGame();

    //when canvas is ready call again for the game loop
    requestAnimationFrame(gameLoop)
}

let lastUpdate = new Date()
function gameUpdate() {
    //calc game update according to game speed, wait for the current time to update game
    if (~~(new Date()) < ~~(lastUpdate) + game.speed * 350)
        return false;
    lastUpdate = new Date()

    directionLock = false;

    //get the head of the snake e.g. the last block that added to it
    const snakeHead = game.snake[game.snake.length - 1];
    //creates the next place that the snake moves to 
    const nextMove = new Block(snakeHead.x + game.playerDirection[0],
        snakeHead.y + game.playerDirection[1])

    //if hits a wall
    if (nextMove.x < 0 || nextMove.x >= gridWidth || nextMove.y < 0 || nextMove.y >= gridHeight) {
        //if without bonus - end game
        if (!game.toggleWalls)
            return gameOver();
        //shift next to the other side
        nextMove.x = (gridWidth + nextMove.x) % gridWidth;
        nextMove.y = (gridHeight + nextMove.y) % gridHeight;
    }

    for (const index in game.snake) {
        snakePart = game.snake[index];

        //if snake ate itself
        if (snakePart.x == nextMove.x && snakePart.y == nextMove.y) {
            snakePart.color = "darkred";
            return gameOver();
        }

        //reset colors to make it looks like the whole snake is moving
        if ((index - game.snake.length % 2) % 2)
            snakePart.color = "limegreen";
        else
            snakePart.color = "lime"
    }

    game.snake.push(nextMove) //adds the next block of the snake to it

    //if apple bite
    if (nextMove.x == game.apple.x && nextMove.y == game.apple.y) {
        game.score++;
        game.speed *= game.speedModifier;
        generateApple();
    }
    else //if no bite - remove last part (essentially if there is a bite dont remove and let the snake become bigger)
        game.snake.shift()//removes the last part of snake;

}

function gameOver(didWon = false) {
    game.isRunning = false;


    ctx.fillStyle = didWon ? "rgba(0,255,255,0.3)" : "rgba(255,0,0,0.3)";

    ctx.fillRect(0, 0, canvas.width, canvas.height)


    const text = (didWon) ? "YOU WON!" : "GAME OVER"

    ctx.font = "15vmin Arial black";
    const m = ctx.measureText(text)

    ctx.fillStyle = "#000";
    ctx.lineWidth = 10
    ctx.strokeText(text, canvas.width / 2 - m.width / 2, canvas.height / 2)
    ctx.fillStyle = "#fff";
    ctx.fillText(text, canvas.width / 2 - m.width / 2, canvas.height / 2)

    document.querySelector(".startBtn").classList.add("glowup")

}

/**finds empty space a places an apple there */
function generateApple() {
    let possibleGrid = [];
    //create 2d grid view as array
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            const searchForSnakePart = game.snake.find((part) => part.x == x && part.y == y)
            //if found part that match that cords - ignore it
            if (searchForSnakePart)
                continue;
            possibleGrid.push([x, y]) //add location to possible apple
        }
    }
    //if no space - uoi won!
    if (possibleGrid.length == 0)
        return gameOver(true)

    const rndGridSpot = possibleGrid[~~(possibleGrid.length * Math.random())]

    game.apple = new Block(rndGridSpot[0], rndGridSpot[1], "red");
}

function drawGame() {
    if (!game.isRunning)
        return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.apple.drawApple(ctx);

    let snakePart;
    for (const index in game.snake) {
        snakePart = game.snake[index];
        snakePart.draw(ctx);
    }
    snakePart.drawHead(ctx, game.playerDirection)


    ctx.font = "5vmin Arial black";
    ctx.lineWidth = 2
    ctx.strokeText("score: " + game.score * 10, 10, 50)

    ctx.fillStyle = "rgba(255,255,255,0.5)"
    ctx.fillText("score: " + game.score * 10, 10, 50)
}

function toggleWalls() {
    game.toggleWalls = !game.toggleWalls;
    document.querySelector(".gameFilter").classList.toggle("walls");
    document.querySelector(".optionBtn").classList.toggle("off");

}