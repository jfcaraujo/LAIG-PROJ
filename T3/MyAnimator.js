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
        let yDif = this.endTile.y - this.startTile.y;
        let xDif = this.endTile.x - this.startTile.x;
        this.animation = new KeyframeAnimation(this.scene, [new Keyframe(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]),
            new Keyframe(1000, [0, 2, 0], [0, 0, 0], [1, 1, 1]),
            new Keyframe(2000, [xDif, 2, yDif], [0, 0, 0], [1, 1, 1]),
            new Keyframe(3000, [xDif, 0, yDif], [0, 0, 0], [1, 1, 1])
        ]);
    }

    update(time) {
        if (this.startTime == 0)
            this.startTime = time;
        else if (time - this.startTime > 3000) {
            this.animating = false;
            this.endTile.setPiece(this.piece);
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