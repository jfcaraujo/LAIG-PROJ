/**
 * MyGameBoard
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameBoard extends CGFobject {
    constructor(scene, pieces) {
        super(scene);
        this.tiles = [ //MyTile(scene,x,y,board,piece)
            [new MyTile(this.scene, 1, 1, this, null), new MyTile(this.scene, 2, 1, this, null), new MyTile(this.scene, 3, 1, this, null), new MyTile(this.scene, 4, 1, this, null)],
            [new MyTile(this.scene, 1, 2, this, null), new MyTile(this.scene, 2, 2, this, null), new MyTile(this.scene, 3, 2, this, null), new MyTile(this.scene, 4, 2, this, null)],
            [new MyTile(this.scene, 1, 3, this, null), new MyTile(this.scene, 2, 3, this, null), new MyTile(this.scene, 3, 3, this, null), new MyTile(this.scene, 4, 3, this, null)],
            [new MyTile(this.scene, 1, 4, this, null), new MyTile(this.scene, 2, 4, this, null), new MyTile(this.scene, 3, 4, this, null), new MyTile(this.scene, 4, 4, this, null)]
        ];
        this.auxBlackTiles = [
            [new MyTile(this.scene, 1, -2, this, new MyPiece(this.scene, 1, pieces)), new MyTile(this.scene, 2, -2, this, new MyPiece(this.scene, 2, pieces)), new MyTile(this.scene, 3, -2, this, new MyPiece(this.scene, 3, pieces)), new MyTile(this.scene, 4, -2, this, new MyPiece(this.scene, 4, pieces))],
            [new MyTile(this.scene, 1, -1, this, new MyPiece(this.scene, 1, pieces)), new MyTile(this.scene, 2, -1, this, new MyPiece(this.scene, 2, pieces)), new MyTile(this.scene, 3, -1, this, new MyPiece(this.scene, 3, pieces)), new MyTile(this.scene, 4, -1, this, new MyPiece(this.scene, 4, pieces))]
        ];
        this.auxWhiteTiles = [
            [new MyTile(this.scene, 1, 6, this, new MyPiece(this.scene, 6, pieces)), new MyTile(this.scene, 2, 6, this, new MyPiece(this.scene, 7, pieces)), new MyTile(this.scene, 3, 6, this, new MyPiece(this.scene, 8, pieces)), new MyTile(this.scene, 4, 6, this, new MyPiece(this.scene, 9, pieces))],
            [new MyTile(this.scene, 1, 7, this, new MyPiece(this.scene, 6, pieces)), new MyTile(this.scene, 2, 7, this, new MyPiece(this.scene, 7, pieces)), new MyTile(this.scene, 3, 7, this, new MyPiece(this.scene, 8, pieces)), new MyTile(this.scene, 4, 7, this, new MyPiece(this.scene, 9, pieces))]
        ];
    }

    addPiece(x, y, piece) {
        this.tiles[y][x].setPiece(piece);
    }

    removePiece(x, y) {
        this.tiles[y][x].removePiece();
    }

    getPiece(x, y) {
        return this.tiles[y][x].getPiece();
    }

    getTile(x, y) {
        return this.tiles[y][x];
    }

    //missing Get tile given a piece

    display() {
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 4; y++)
                this.getTile(x, y).display();
        for (var x = 0; x < 4; x++)
            for (var y = 0; y < 2; y++) {
                this.auxWhiteTiles[y][x].display();
                this.auxBlackTiles[y][x].display();
            }
            //add display outside of board
    }

}