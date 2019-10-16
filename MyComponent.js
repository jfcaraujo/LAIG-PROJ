/**
 * MyComponent
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyComponent extends CGFobject {
    constructor(scene, id, transformation, materials, texture, children, leaves) {
        super(scene);
        this.scene = scene;
        this.id = id;
        this.transformation = transformation;
        this.materials = materials;
        this.currentMaterialIndex=0;
        this.currentMaterialID=this.materials[0];
        this.texture = texture;
        this.children = children;
        this.leaves = leaves;
    }

    updateMaterial(){
        this.currentMaterial++;
        if (this.currentMaterialIndex==this.materials.lenght)
            this.currentMaterialIndex=0;
        this.currentMaterial=this.materials[this.currentMaterialIndex];
    }
}