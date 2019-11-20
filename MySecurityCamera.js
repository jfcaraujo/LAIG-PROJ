/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle = new MyRectangle(scene, 1, 0.5, 1.0, -1.0, -0.5);

    }


    display() {
        this.scene.textureRTT.bind();
        this.scene.setActiveShader(this.scene.shader);
        this.rectangle.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.textureRTT.unbind();
    }
}