/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle = new MyRectangle(scene, 1, 0.5, 1, -1, -0.5);

        this.shader = new CGFshader(this.scene.gl, "scenes/text.vert", "scenes/text.frag");
        this.shader.setUniformsValues({ timeFactor: 0 });

    }


    display() {
        this.scene.setActiveShader(this.shader);
        this.scene.textureRTT.bind();
        this.rectangle.display();
        this.scene.textureRTT.unbind();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}