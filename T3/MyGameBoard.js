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

        for (var x = 0; x < 4; x++) //add tiles to pieces
            for (var y = 0; y < 2; y++) {
            this.auxWhiteTiles[y][x].getPiece().setTile(this.auxWhiteTiles[y][x]);
            this.auxBlackTiles[y][x].getPiece().setTile(this.auxBlackTiles[y][x]);
        }
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

    getPieceByType(type) {
        let x = (type % 5) - 1;
        let board;
        if (type > 5)
            board = this.auxWhiteTiles;
        else board = this.auxBlackTiles;
        let piece = board[0][x].getPiece();
        if (piece == null)
            piece = board[1][x].getPiece();
        return piece;
    }

    getTileWithCoords(x, y) {
        return this.tiles[y][x];
    }

    getTileWhithPiece(piece) {
        return piece.getTile();
    }

    display() {
        for (let x = 0; x < 4; x++)
            for (let y = 0; y < 4; y++)
                this.getTileWithCoords(x, y).display();
        for (let x = 0; x < 4; x++)
            for (let y = 0; y < 2; y++) {
                this.auxWhiteTiles[y][x].display();
                this.auxBlackTiles[y][x].display();
            }
            //add display outside of board
    }

    getBoardForProlog() {
        let board = "[";
        for (let y = 0; y < 4; y++) {
            let tempList = "[";
            for (let x = 0; x < 4; x++) {
                let piece = this.getTileWithCoords(x, y).getPiece();
                if (piece == null)
                    tempList += "0";
                else tempList += piece.getType();
                if (x < 3) tempList += ",";
            }
            board += tempList + "]";
            if (y < 3) board += ",";
        }
        board += "]";
        return board;
    }

    getPiecesForProlog(player) {
        let tempList;
        if (player == 1) {
            tempList = this.auxWhiteTiles;
        } else tempList = this.auxBlackTiles;

        let tempString = "[";
        for (let x = 0; x < 4; x++)
            for (let y = 0; y < 2; y++) {
                let piece = tempList[y][x].piece;
                if (piece != null)
                    tempString += piece.getType() + ",";

            }
        return tempString = tempString.slice(0, -1) + "]";
    }
}