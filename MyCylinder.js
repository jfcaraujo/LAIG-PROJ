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

    var radiusDif = this.radiusBase - this.radiusTop;
    var ang = 0;
    var alphaAng = (2 * Math.PI) / this.slices;
    var normAng = Math.atan(radiusDif / this.height);
    this.stackHeight = this.height / this.stacks;
    var radius = this.radiusBase;
    this.pointsPerStack = this.slices + 1;

    for (var x = 0; x <= this.stacks; x++) {
      ang = 0;
      for (var i = 0; i < this.pointsPerStack; i++) {
        this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, this.stackHeight * x);
        if (x > 0 && i > 0) {
          this.indices.push((x - 1) * this.pointsPerStack + i - 1, x * this.pointsPerStack + i - 1, x * this.pointsPerStack + i);
          this.indices.push((x - 1) * this.pointsPerStack + i - 1, x * this.pointsPerStack + i, (x - 1) * this.pointsPerStack + i);
        }
        this.normals.push(Math.cos(ang) * Math.cos(normAng), -Math.sin(ang) * Math.cos(normAng), Math.sin(normAng));
        this.texCoords.push(i / this.slices, x * this.stackHeight);
        ang += alphaAng;
      }
      radius -= radiusDif / this.stacks;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  updateTexCoords(s, t) {/*
    this.texCoords = [];
    for (var x = 0; x <= this.stacks; x++) {
      for (var i = 0; i < this.pointsPerStack; i++) {
        this.texCoords.push(i / this.slices / s, x * this.stackHeight / t);
      }
    }*/
  }
}
