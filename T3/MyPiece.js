/**
 * MyPiece
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyPiece extends CGFobject {
    constructor(scene, type, pieces) {
        super(scene);
        this.type = type;
        this.tile = null;
        this.object = pieces[(this.type % 5) - 1];
    }

    getType() {
        return this.type;
    }

    setTile(tile) {
        this.tile = tile;
    }

    getTile() {
        return this.tile;
    }

    display() {
        this.scene.pushMatrix();

        if (this.type > 5) { //if is white
            this.material = this.scene.gameOrchestrator.graph.materials['whitepieces'];
        } else {
            this.material = this.scene.gameOrchestrator.graph.materials['blackpieces'];
        }
        this.material.setTexture(this.scene.gameOrchestrator.graph.textures['pieceTexture']);
        this.material.apply();
        this.object.display();
        this.scene.popMatrix();
    }
}