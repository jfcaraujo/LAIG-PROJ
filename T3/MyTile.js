/**
 * MyTile
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTile extends CGFobject {
    constructor(scene, X, Y, board, piece) {
        super(scene);
        this.x = X;
        this.y = Y;
        this.board = board;
        this.piece = piece;
    }

    setPiece(piece) {
        if (this.piece == null)
            this.piece = piece;
        else console.log("There is already a piece on tile " + this.x + ", " + this.y);
    }

    removePiece() {
        if (this.piece != null)
            this.piece = null;
        else console.log("There is no piece to remove on tile " + this.x + ", " + this.y);
    }

    getPiece() {
        return this.piece;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, 0, this.y);
        if (this.piece != null)
            this.piece.display();
        //TODO add tile display
        this.scene.popMatrix();
    }

}