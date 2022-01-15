let point = null;
let score = 0;
let end = false;
let ended = false;
let reset = false;
let levelUp = false;
let htmlScore;

//set default parameters
function initializeGame(){

    let form = document.getElementById("fields");
    fields.setAttribute("disabled", "");
    htmlScore = document.getElementById("score");
    let board = document.getElementById("board"); //canvas id
    let rowWidth = document.getElementById("gameWidth").value; //how many tiles wide
    let rowHeight = document.getElementById("gameHeight").value; //how many tiles tall
    let tileX = document.getElementById("gameTileSize").value; //pixels each tile is wide
    let tileY = document.getElementById("gameTileSize").value; //pixels each tile is tall
    let ctx = board.getContext("2d"); //canvas context for rendering

    //parameters given to new map object
    let map = new Map(rowWidth, rowHeight);

    //add error checking for size, no 0x0 grid
    //sets html canvas to correct size
    board.width = rowWidth * tileX;
    board.height = rowHeight * tileY;
    
    //create grid and place player
    map.generateGrid(tileX, tileY);
    let player = new Player(placePlayer(map));

    point = new Score(placePoint(map));

    //sets matching x and y inside player object
    player.setXPos = map.getSpecificTile(player.getPosition).getXPos;
    player.setYPos = map.getSpecificTile(player.getPosition).getYPos;
    player.setLastPosition = map.searchTiles(player.getXPos, player.getYPos);
    //adds starting tile to stack
    player.processStack(map.getSpecificTile(player.getPosition));


    if(player.getYPos == 0 || player.getYPos == 1){
        player.direction = 2;
    }

    //listens for keys and sets player direction based on arrow keys (see player.js setDirecton())
    window.addEventListener("keydown", function(e){
        player.setDirection = e;
    });

    //while(player.getStatus = true){
    gameLoop(player, map, ctx, point);
    //}
}

function endGame(){
    end = true;
}

function restartGame(){
    if(ended == true){
        clearGame();
        initializeGame();
    }
    else{
    endGame();
    reset = true;
    }
}

function clearGame(){
    point = null;
    score = 0;
    end = false;
    ended = false;
    reset = false;
    levelUp = false;
    htmlScore = 0;
}

//chooses a random tile to place the player at the beginning of the game
function placePlayer(map){
    
    let i = Math.floor((Math.random() * map.getGridLength));
    let positionSet = map.getSpecificTile(i);
    positionSet.setOccupied = true;
    return i;
}

function placePoint(map){
    let i = Math.floor((Math.random() * map.getGridLength));
    let positionSet = map.getSpecificTile(i);
    positionSet.setPointOccupation = true;
    return i;
}

//moves player in the direction that the player was set
function movePlayer(player){
    if (player.getDirection == 0){ // north
        player.setYPos = player.getYPos-= 1;
    }
    if (player.getDirection == 1){ // east
        player.setXPos = player.getXPos+= 1;
    }
    if (player.getDirection == 2){ // south
        player.setYPos = player.getYPos+= 1;
    }
    if (player.getDirection == 3){ // west
        player.setXPos = player.getXPos-= 1;
    }
}

function isPointScored(player, point){
    if(player.getPosition == point.getPosition){
        return true;
    }
    return false;
}

//makes the previous tile the player occupied unoccupied
function clearLast(player, lastPosition, map){

    tile = map.getSpecificTile(lastPosition);
    tile.setOccupied = false;

}

//finds the current tile that the player is in and sets it to occupied
//try/catch ends game if player goes out of bounds
function occupyNext(player, map, ctx){

    let playerX = player.getXPos;
    let playerY = player.getYPos;
    let index = map.searchTiles(playerX, playerY); //returns matching index
    let tile = map.getSpecificTile(index);

    try{
    if(tile.occupied == true){
        end = true;
    }
    }
    catch(err){
        end = true;
    }

    try{
    tile.setOccupied = true;
    }
    catch(err){
        end = true;
    }

    player.setPosition = index; //sets player position to tile index
    player.processStack(tile);
    player.cloneStack();

    try{
    for(i = 0;i < player.size + 1 ; i++){

        let oTile = player.getClearStackQueuePop;
        oTile.setOccupied = false;
        drawPlayer(oTile, ctx);
    }

    for(i = 0;i < player.size; i++){
        let oTile = player.getStackQueuePop;
        oTile.setOccupied = true;
        drawPlayer(oTile, ctx);
        
    }
    }
    catch(err){
        end = true;
    }

}

//starts loop
function gameLoop(player, map, ctx, point){

    let level = 1;
    let speed = 700;
    let sGame = setInterval(game, speed);
    draw(map, ctx);
    function game(){

    gameLogic(player, map, point, ctx); //process game logic
    //draw(map, ctx); //render scene
    if(end == true){
        clearInterval(sGame);
        ended = true;
    }

    if(reset == true){
        clearInterval(sGame);
        clearGame();
        initializeGame();
    }

    if(levelUp == true && level == 1){
        clearInterval(sGame);
        speed -= 100;
        sGame = setInterval(game, speed);
        levelUp = false;
    }
    else if(levelUp == true && level == 2){
        clearInterval(sGame);
        speed -= 100;
        sGame = setInterval(game, speed);
    }
}
}

//handles logic
function gameLogic(player, map, point, ctx) {

    //check player direction
    let playerX = player.getXPos;
    let playerY = player.getYPos;
    let scored = isPointScored(player, point);

    //finds tile the player is occupying
    let index = map.searchTiles(playerX, playerY); //returns matching index
    if(scored == true){
        map.getSpecificTile(index).setPointOccupation = false;
        point.setPosition = placePoint(map);
        drawPoint(map.getSpecificTile(point.getPosition), ctx);
        player.size += 1;
        score += 1;
        if(score % 10 == 0){
            levelUp = true;
        }
        scored = false;
        htmlScore.innerHTML = "Score: " + score;
    }
    movePlayer(player);
    player.setLastPosition = index; //sets last position of player
    occupyNext(player, map, ctx);
    player.emptyCloneStack();
}

//draw grid
function draw(map, ctx){

    fillGrid(map, ctx); //color
    drawGrid(map, ctx); //gridlines
}

//color, renders background of grid -> runs once
function fillGrid(map, ctx){
    let xHeader = 0;
    let yHeader = 0;
    let count = 0;
    let rowWidth = map.getRowWidth;

    for(i=0; i < map.getGrid.length; i++){
        let width = parseInt(map.getSpecificTile(i).getWidth);
        let height = parseInt(map.getSpecificTile(i).getHeight);
        let occupied = map.getSpecificTile(i).getOccupation;
        let point = map.getSpecificTile(i).getPointOccupation;

        //if end of row move to next
        if(count == rowWidth){
            xHeader = 0;
            yHeader += height;
            count = 0;
            i -= 1;
        } 
        else if(count < rowWidth){
            ctx.moveTo(xHeader, yHeader);
            ctx.beginPath();

            //if player is in tile
            if(occupied == true){
                ctx.fillStyle = "red";
                ctx.fillRect(xHeader,yHeader, width, height);
            //if tile is a point
            } else if(point == true){
                ctx.fillStyle = "yellow";
                ctx.fillRect(xHeader,yHeader, width, height);
            //if tile is not occupied
            } else if(occupied == false && point == false){
                ctx.fillStyle = "green";
                ctx.fillRect(xHeader,yHeader, width, height);
            }
            ctx.stroke();
            count += 1;
            xHeader += width;
        }
    }
}

//gridlines is a copy of fillGrid to render gridlines -> runs once
function drawGrid(map, ctx){
    let xHeader = 0;
    let yHeader = 0;
    let count = 0;
    let rowWidth = map.getRowWidth;

    for(i=0; i < map.getGrid.length; i++){
        let width = parseInt(map.getSpecificTile(i).getWidth);
        let height = parseInt(map.getSpecificTile(i).getHeight);

        if(count == rowWidth){
            xHeader = 0;
            yHeader += height;
            count = 0;
            i -= 1;
        } 
        else if(count < rowWidth){
            ctx.moveTo(xHeader, yHeader);
            ctx.beginPath();
            ctx.rect(xHeader,yHeader, width, height);
            ctx.stroke();
            count += 1;
            xHeader += width;
        }
    }
}

//draws only the player each cycle
function drawPlayer(tile, ctx){

    let x = tile.getXPos * tile.getWidth;
    let y = tile.getYPos * tile.getHeight;

    ctx.moveTo(x, y);
    ctx.beginPath();

        //if player is in tile
        if(tile.getOccupation == true){
            ctx.fillStyle = "red";
            ctx.fillRect(x, y, tile.getWidth, tile.getHeight);
        //if tile is a point
        } else if(tile.getPointOccupation == true){
            ctx.fillStyle = "yellow";
            ctx.fillRect(x, y, tile.getWidth, tile.getHeight);
        //if tile is not occupied
        } else if(tile.getOccupation == false && tile.getPointOccupation == false){
            ctx.fillStyle = "green";
            ctx.fillRect(x, y, tile.getWidth, tile.getHeight);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x, y, tile.getWidth, tile.getHeight);
        ctx.stroke();
}

//draws a new point every time player scores a point
function drawPoint(tile, ctx){

    let x = tile.getXPos * tile.getWidth;
    let y = tile.getYPos * tile.getHeight;

    ctx.moveTo(x, y);
    ctx.beginPath();

    ctx.fillStyle = "yellow";
    ctx.fillRect(x, y, tile.getWidth, tile.getHeight);

    ctx.stroke();
    ctx.beginPath();
    ctx.rect(x, y, tile.getWidth, tile.getHeight);
    ctx.stroke();
}