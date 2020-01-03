/**
 * MyGameMove
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameMove extends CGFobject {
    constructor(scene, piece, startTile, endTile, board, whitePieces, blackPieces) {
        super(scene);
        this.piece = piece;
        this.startTile = startTile;
        this.endTile = endTile;
        this.board = board; //before the move
        this.whitePieces = whitePieces;
        this.blackPieces = blackPieces;
    }

    animate() {}
}