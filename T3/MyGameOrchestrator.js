/**
 * MyGameOrchestrator
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyGameOrchestrator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.graph = new MySceneGraph("demo.xml", this.scene);
    }

    restart() {
        this.gameSequence = new MyGameSequence(this.scene);
        this.animator = new MyAnimator(this.scene, this);
        this.gameboard = new MyGameBoard(this.scene, this.graph.pieces);
        //this.prolog = new MyPrologInterface(this.scene);

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

    movePiece(move) { //TODO split in 2
        let x1 = move.startTile.x;
        let y1 = move.startTile.y;
        let x2 = move.endTile.x;
        let y2 = move.endTile.y;
        if (y1 > 0 && y1 < 5)
            console.log("Can't start a move there");
        else if (y2 < 0 || y2 > 5)
            console.log("Can't move a piece there");
        else {
            this.gameboard.removePiece(x1, y1);
        }
        this.gameSequence.addMove(move);
        this.animator.animate(move);
    }

    orchestrate() {}

}