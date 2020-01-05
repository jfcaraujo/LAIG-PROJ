/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.graph = new MySceneGraph("demo.xml", this.scene);
        this.prolog = new MyPrologInterface(this.scene);
    }

    restart() {
        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this.scene, this);
        this.gameboard = new MyGameBoard(this.scene, this.graph.pieces);
        this.tilesToPlay = [];
        this.state = 0;
        this.player = 1;
        this.startTile = null;
        this.replied = true;
        /*states: 
        0-beginning of play
        1-after piece was selected, waiting for tile
        2-animating(after tile was selected)
        3-game over
        */
    }

    update(time) {
        if (this.animator.animating)
            this.animator.update(time);
    }
    display() {
        this.graph.displayScene();
        this.gameboard.display();
        if (this.animator.animating)
            this.animator.display();
    }

    changeTheme(theme) {
        this.scene.sceneInited = false;
        this.scene.time = null;
        this.graph = new MySceneGraph(theme, this.scene);
    }

    movePiece(move) {
        this.state = 2;
        this.gameSequence.addMove(move);
        this.animator.animate(move);
        move.startTile.removePiece();
        move.piece.setTile(move.endTile);
    }

    orchestrate() {
        if (this.state == 0 && this.replied == true) {
            let smart;
            if (this.scene.intelligent)
                smart = "smart";
            else smart = "random";
            if ((this.scene.gameMode > 0 && this.player == 2) || (this.scene.gameMode == 2 && this.player == 1)) {
                this.replied = false;
                this.state = 2;
                this.prolog.getBotMove(smart, this.gameboard.getBoardForProlog(), this.gameboard.getPiecesForProlog(this.player));
            }
        }
    }

    managePick(results) {
        if (this.state < 2) {
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = results[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                results.splice(0, results.length);
            }
        }
    }

    OnObjectSelected(obj, uniqueId) {
        if (obj instanceof MyPiece) {
            this.state = 1;
            this.startTile = obj.getTile();
            console.log("Picked piece with xy " + uniqueId);
            this.prolog.getAvailableMoves(obj.type, this.gameboard.getBoardForProlog());
        } else if (obj instanceof MyTile) {
            console.log("Picked tile with xy " + uniqueId);
            this.movePiece(new MyGameMove(this.scene, this.startTile.getPiece(), this.startTile, obj, this.gameboard.tiles, this.gameboard.auxWhiteTiles, this.gameboard.auxBlackTiles))
        }
    }

    changeTurn() {
        this.prolog.checkWin(this.gameboard.getBoardForProlog());
        this.player = 1 + (this.player % 2);
        //move camera
        this.tilesToPlay = [];
        this.startTile = null;
        if (this.state != 3) this.state = 0;
    }

    undo() {
        let move = this.gameSequence.undo();
        this.state = 2;
        this.animator.animate(new MyGameMove(this.scene, move.endTile.getPiece(), move.endTile, move.startTile, this.gameboard.tiles, this.gameboard.auxWhiteTiles, this.gameboard.auxBlackTiles));
        move.endTile.removePiece();
        move.piece.setTile(move.startTile);
    }
}