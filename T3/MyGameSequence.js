/**
 * MyGameSequence
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameSequence extends CGFobject {
    constructor(scene) {
        super(scene);
        this.moves = [];
    }

    addMove(move) {
        const mov = move;
        this.moves.push(mov);
    }

    undo() {
        const move = this.moves.pop();
        return move;
    }

    animate() {
        if (!this.scene.gameOrchestrator.animator.animating) {
            if (this.currentMove == this.moves.length) {
                this.scene.animating = false;
                this.scene.moviePlaying = false;
                this.scene.gameOrchestrator.gameBoard = this.moves[0].board;
                this.scene.interface.currentCameraId = this.scene.graph.defaultCameraId;
            } else {
                //this.scene.gameOrchestrator.gameboard.tiles = this.moves[this.currentMove].board;
                //this.scene.gameOrchestrator.gameboard.auxWhiteTiles = this.moves[this.currentMove].whitePieces;
                // this.scene.gameOrchestrator.gameboard.auxBlackTiles = this.moves[this.currentMove].blackPieces;
                this.moves[this.currentMove].animate();
                this.currentMove++;
            }
        }
    }
}