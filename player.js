class Player {
    constructor(position){
        this.score = 0; //tracks player score
        this.direction = 0; //0=north 1=east 2=south 3=west
        this.position = position; //contains tile the player is currently in
        this.lastPosition = position; //last position
        this.xPos;
        this.yPos;
        this.size = 1;
        this.positionsStack = [];
        this.stackQueue = [];
        this.clearStackQueue = [];
    }

    setDirection(Event){
        if(Event.code === "ArrowUp"){ // north
            this.direction = 0;
        }
        else if(Event.code === "ArrowRight"){ // east
            this.direction = 1;
        }
        else if(Event.code === "ArrowDown"){ // south
            this.direction = 2;
        }
        else if(Event.code === "ArrowLeft"){ // west
            this.direction = 3;
        }
    }

    processStack(tile){

 
        this.positionsStack.push(tile);

        //cleans the stack preventing a memory leak
        if(this.positionsStack.length > this.size + 1){
            while(this.positionsStack.length > this.size + 1){
                this.positionsStack.shift();
            }
        }
    }

    cloneStack(){

        this.stackQueue = this.positionsStack.map((x) => x);
        this.clearStackQueue = this.positionsStack.map((x) => x);
    }

    emptyCloneStack(){
        this.stackQueue = [];
    }
    
    setScore(point){
        this.score += point;
    }

    setXPos(x){
        this.xPos = x;
    }

    setYPos(y){
        this.yPos = y;
    }

    setLastPosition(position){
        this.lastPosition = position;
    }

    setPosition(position){
        this.position = position;
    }

    get getScore(){
        return this.score;
    }

    get getXPos(){
        return this.xPos;
    }

    get getYPos(){
        return this.yPos;
    }

    get getStatus(){
        return this.status;
    }

    get getDirection(){
        return this.direction;
    }

    get getPosition(){
        return this.position;
    }

    get getLastPosition(){
        return this.lastPosition;
    }
}

class Score{
    constructor(position){
        this.position = position;
    }

    setPosition(position){
        this.position = position;
    }

    get getPosition(){
        return this.position;
    }
}