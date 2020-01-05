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
        this.tile = new MyPlane(this.scene, "tyle" + X + ", " + Y, 1, 1);
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

        if (this.piece != null) { //piece
            if (this.scene.gameOrchestrator.state < 2 && ((this.y > 5 && this.scene.gameOrchestrator.player == 1) || (this.y < 0 && this.scene.gameOrchestrator.player == 2)))
                this.scene.registerForPick(this.x * 10 + this.y, this.getPiece());
            this.piece.display();
            this.scene.clearPickRegistration();
        }

        if (this.y < 0) { //auxBlackBoard
            this.material = this.scene.gameOrchestrator.graph.materials['whitepieces'];
            this.texture = 'whitetyle';
        } else if (this.y > 5) { //auxWhiteBoard
            this.material = this.scene.gameOrchestrator.graph.materials['blackpieces'];
            this.texture = 'blacktyle';
        } else if ((this.y < 3 && this.x < 3) || (this.y > 2 && this.x > 2)) {
            this.material = this.scene.gameOrchestrator.graph.materials['whitepieces'];
            this.texture = 'whitetyle';
        } else {
            this.material = this.scene.gameOrchestrator.graph.materials['blackpieces'];
            this.texture = 'blacktyle';
        }
        if (this.scene.gameOrchestrator.state == 1 && this.y > 0 && this.y < 5) {
            for (let i = 0; i < this.scene.gameOrchestrator.tilesToPlay.length; i++) {
                let coord = this.scene.gameOrchestrator.tilesToPlay[i];
                if (coord[0] == this.x && coord[1] == this.y) { //se for valid move
                    this.material = this.scene.gameOrchestrator.graph.materials['blueGameMaterial'];
                    this.scene.registerForPick(this.x * 10 + this.y, this);
                }
            }
        }
        this.material.setTexture(this.scene.gameOrchestrator.graph.textures[this.texture]);
        this.material.apply();

        this.tile.display();
        this.scene.clearPickRegistration();
        this.scene.popMatrix();
    }

}