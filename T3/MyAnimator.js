/**
 * MyAnimator
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyAnimator extends CGFobject {
    constructor(scene, orchestrator) {
        super(scene);
        this.orchestrator = orchestrator;
        this.animating = false;
    }

    animate(move) {
        this.animating = true;
        this.startTime = 0;
        this.startTile = move.startTile;
        this.endTile = move.endTile;
        this.piece = move.piece;
        let matrix = mat4.create();
        mat4.translate(matrix, matrix, [this.startTile.x, 0, this.startTile.y]);
        this.animation = new KeyframeAnimation(this.scene, [new Keyframe(0, [this.startTile.x, 0, this.startTile.y], [0, 0, 0], [1, 1, 1]),
            new Keyframe(1000, [this.startTile.x, 2, this.startTile.y], [0, 0, 0], [1, 1, 1]),
            new Keyframe(2000, [this.endTile.x, 2, this.endTile.y], [0, 0, 0], [1, 1, 1]),
            new Keyframe(3000, [this.endTile.x, 0, this.endTile.y], [0, 0, 0], [1, 1, 1])
        ], matrix);
    }

    update(time) {
        if (this.startTime == 0)
            this.startTime = time;
        else if (time - this.startTime > 3000) {
            this.animating = false;
            this.endTile.setPiece(this.piece);
            this.orchestrator.changeTurn();
        }
        this.animation.update(time - this.startTime);
    }

    display() {
        this.scene.pushMatrix();
        this.animation.apply();
        this.piece.display();
        this.scene.popMatrix();
    }
}