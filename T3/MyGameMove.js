/**
 * MyGameMove
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameMove extends CGFobject {
    constructor(scene, piece, startTile, endTile, board) {
        super(scene);
        this.piece = piece;
        this.startTile = startTile;
        this.endTile = endTile;
        this.board = board;
    }

    animate() {
        this.scene.gameOrchestrator.animator.animate(this);
        this.scene.gameOrchestrator.gameboard.getTileWithTile(this.startTile).removePiece();
        //this.piece.setTile(this.endTile);
    }
}