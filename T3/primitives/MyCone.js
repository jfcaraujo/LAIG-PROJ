/**
 * MyCone
 * @constructor
 */
class MyCone extends CGFobject {
    constructor(scene, id, slices, stacks, height, baseRadius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radiusBase = baseRadius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let ang = 0;
        const alphaAng = (2 * Math.PI) / this.slices;
        const normAng = Math.atan(this.radiusBase / this.height);
        this.stackHeight = this.height / this.stacks;
        let radius = this.radiusBase;
        this.pointsPerStack = this.slices + 1;


        //base
        for (let i = 0; i < this.pointsPerStack; i++) {
            this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, 0);
            this.normals.push(0, 0, -1);
            if (i > 1)
                this.indices.push(0, i - 1, i);
            ang += alphaAng;

        }
        //parede
        for (let x = 0; x <= this.stacks; x++) {
            ang = 0;
            for (let i = 0; i < this.pointsPerStack; i++) {
                this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, this.stackHeight * x);
                if (x > 0 && i > 0) {
                    this.indices.push(x * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i);
                    this.indices.push(x * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i, x * this.pointsPerStack + i);
                }
                this.normals.push(Math.cos(ang) * Math.cos(normAng), -Math.sin(ang) * Math.cos(normAng), Math.sin(normAng));
                ang += alphaAng;
            }
            radius -= this.radiusBase / this.stacks;
        }
        this.vertices.push(0, 0, this.height);
        this.normals.push(0, 0, 1);
        /*for (let i = 0; i < this.pointsPerStack; i++) {//indices do topo
            this.indices.push(this.vertices.length / 3 - 2 - i, this.vertices.length / 3 - 3 - i, this.vertices.length / 3 - 1);
        }*/

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(s, t) {
    }
}
