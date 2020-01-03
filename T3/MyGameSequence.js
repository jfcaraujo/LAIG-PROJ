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
        this.moves.push(move);
    }

    undo() {
        const move = this.moves[this.moves.length - 1];
        this.moves.pop();
        return move;
    }
}