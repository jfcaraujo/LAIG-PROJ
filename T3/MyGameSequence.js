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
}