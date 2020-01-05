/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, id, slices, stacks, height, baseRadius, topRadius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radiusBase = baseRadius;
        this.radiusTop = topRadius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const radiusDif = this.radiusBase - this.radiusTop;
        let ang = 0;
        const alphaAng = (2 * Math.PI) / this.slices;
        const normAng = Math.atan(radiusDif / this.height);
        this.stackHeight = this.height / this.stacks;
        let radius = this.radiusBase;
        this.pointsPerStack = this.slices + 1;

        //base
        for (let i = 0; i < this.pointsPerStack; i++) {
            this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, 0);
            this.texCoords.push(radius * Math.cos(ang), -Math.sin(ang) * radius);
            this.normals.push(0, 0, -1);
            if (i > 1)
                this.indices.push(0, i - 1, i);
            ang += alphaAng;
        }

        //wall
        for (let x = 0; x <= this.stacks; x++) {
            ang = 0;
            for (let i = 0; i < this.pointsPerStack; i++) {
                this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, this.stackHeight * x);
                if (x > 0 && i > 0) {
                    this.indices.push(x * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i);
                    this.indices.push(x * this.pointsPerStack + i - 1, (x + 1) * this.pointsPerStack + i, x * this.pointsPerStack + i);
                }
                this.normals.push(Math.cos(ang) * Math.cos(normAng), -Math.sin(ang) * Math.cos(normAng), Math.sin(normAng));
                this.texCoords.push(i / this.slices, x * this.stackHeight);
                ang += alphaAng;
            }
            radius -= radiusDif / this.stacks;
        }

        //top
        let points = -1 + this.vertices.length / 3;
        ang = 0;
        radius += radiusDif / this.stacks;
        for (let i = 0; i < this.pointsPerStack; i++) {
            this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, this.height);
            this.texCoords.push(radius * Math.cos(ang), -Math.sin(ang) * radius);
            this.normals.push(0, 0, 1);
            if (i > 1)
                this.indices.push(points, i + points, i - 1 + points);
            ang += alphaAng;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(s, t) {
        /*
            this.texCoords = [];
            for (var x = 0; x <= this.stacks; x++) {
              for (var i = 0; i < this.pointsPerStack; i++) {
                this.texCoords.push(i / this.slices / s, x * this.stackHeight / t);
              }
            }*/
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0.5);
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);
        super.display();
        this.scene.popMatrix();
    }
}