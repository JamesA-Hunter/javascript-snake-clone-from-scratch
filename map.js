class Map {
    constructor(width, height){
        this.x = 0;
        this.y = 0;
        this.rowWidth = width; //how many tiles wide each row will be
        this.rowHeight = height; //how many rows the grid will be
        this.rows = []; //array that holds every tile
    }

    generateGrid(tileX, tileY){
        let row = 0;
        let x = this.x;
        let y = this.y;

        while(row < this.rowHeight){
        this.generateRow(x, y, tileX, tileY);
        y += 1;
        row += 1;
        }
        
    }

    generateRow(x, y, tileX, tileY){
        let count = 0;
        let rowX = x;

        while(count < this.rowWidth){
            let tile = new Tile(rowX, y, tileX, tileY);
            this.addRow(tile);
            rowX += 1;
            count += 1;
        }
    }

    //add tile to row
    addRow(tile){
        this.rows.push(tile);
    }

    //returns specific tile obects at a specific index of rows[]
    getSpecificTile(i){
        return this.rows[i];
    }

    //finds specific index of a tile that matches x & y
    searchTiles(x,y){

        let i = 0;
        for(i = 0;i<this.rows.length; i++){
            let tile = this.rows[i];
            let tileX = tile.getXPos;
            let tileY = tile.getYPos;

            if(tileX === x && tileY === y){
                return i;
            }
        }
    }

    get getGrid(){
        return this.rows;
    }

    get getGridLength(){
        return this.rows.length;
    }

    get getRowWidth(){
        return this.rowWidth;
    }

    get getRowHeight(){
        return this.rowHeight;
    }
}

class Tile{
    constructor(x, y, tileX, tileY){
        this.xPos = x; //position of tile on x axis on canvas
        this.yPos = y; //position of tile on y axis on canvas
        this.width = tileX; //pixel width of tile
        this.height = tileY; //pixel height of tile
        this.occupied = false; //remove and update functions
        this.playerOccupation = false; //is player occupying tile
        this.pointOccupation = false; //is a point occupying tile
    }

    setOccupied(occupation){
        this.occupied = occupation;
    }

    setPlayerOccupation(occupation){
        this.playerOccupation = occupation;
    }

    setPointOccupation(occupation){
        this.pointOccupation = occupation;
    }

    get getOccupation(){
        return this.occupied;
    }

    get getPointOccupation(){
        return this.pointOccupation;
    }

    get getWidth(){
        return this.width;
    }

    get getHeight(){
        return this.height;
    }

    get getXPos(){
        return this.xPos;
    }

    get getYPos(){
        return this.yPos;
    }
}