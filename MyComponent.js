/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyComponent extends CGFobject {
    constructor(scene, id, transformation, material, texture, children, leaves) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.transformation = transformation;
        this.material = material;
        this.texture = texture;
        this.children = children;
        this.leaves = leaves;
    }
}