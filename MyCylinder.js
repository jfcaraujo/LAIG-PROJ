/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
  constructor(scene, slices, stacks, height, baseRadius, topRadius) {
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
    var stackHeight = this.height / this.stacks;
    var radius = this.radiusBase;
    var pointsPerStack = this.slices + 1;

    for (var x = 0; x <= this.stacks; x++) {
      ang = 0;
      for (var i = 0; i < pointsPerStack; i++) {
        this.vertices.push(radius * Math.cos(ang), -Math.sin(ang) * radius, stackHeight * x);
        if (x > 0 && i > 0) {
          this.indices.push((x - 1) * pointsPerStack + i - 1, x * pointsPerStack + i - 1, x * pointsPerStack + i);
          this.indices.push((x - 1) * pointsPerStack + i - 1, x * pointsPerStack + i, (x - 1) * pointsPerStack + i);
        }
        /*if (x == 1 && i == 3)
          this.indices.push(3, 5, 4);*/
        this.normals.push(Math.cos(ang) * Math.cos(normAng), -Math.sin(ang) * Math.cos(normAng), Math.sin(normAng));
        this.texCoords.push(i / this.slices, x * stackHeight);
        ang += alphaAng;
      }
      radius -= radiusDif / this.stacks;
    } /*
    var x = 2 * (this.slices + 1);
    for (var i = 0; i <= this.slices; i++) {
      this.vertices.push(
        this.radiusBase * Math.cos(ang),
        0,
        -Math.sin(ang) * this.radiusBase
      );
      if (i > 2) {
        this.indices.push(x + this.slices, x + i - 1, x + i - 2); //verificar ordem
      }
      this.normals.push(0, -1, 0);
      this.texCoords.push(
        0.5 + 0.5 * Math.cos(ang),
        0.5 + 0.5 * -Math.sin(ang)
      );
      ang += alphaAng;
    }
    var x = 3 * (this.slices + 1);
    for (var i = 0; i <= this.slices; i++) {
      this.vertices.push(
        this.radiusTop * Math.cos(ang),
        this.stacks,
        -Math.sin(ang) * this.radiusTop
      );
      if (i > 2) {
        this.indices.push(x + i - 2, x + i - 1, x + this.slices); //verificar ordem
      }
      this.normals.push(0, 1, 0);
      this.texCoords.push(
        0.5 + 0.5 * Math.cos(ang),
        0.5 + 0.5 * -Math.sin(ang)
      );
      ang += alphaAng;
    }*/

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
	/*
  updateBuffers(complexity) {
    this.slices = 10 + Math.round(20 * complexity); //complexity varies 0-1, so slices varies 10-30

    // reinitialize buffers
    this.initBuffers();
    this.initNormalVizBuffers();
  }*/
}
