/**
 * MyCylinder2
 * @constructor
 */
class MyCylinder2 extends CGFobject {
  constructor(scene, id, slices, stacks, height, baseRadius, topRadius) {
    super(scene);
    this.slices = slices;
    this.stacks = stacks;
    this.height = height;
    this.radiusBase = baseRadius;
    this.radiustop = topRadius;
    this.initBuffers();
  }

  initBuffers() {
    this.controlPoints = [
      [
        [-this.radiustop, 0.0, this.height, 1],
        [-this.radiusBase, 0.0, 0.0, 1]
      ],
      [
        [-this.radiustop, (4 / 3) * this.radiustop, this.height, 1],
        [-this.radiusBase, (4 / 3) * this.radiusBase, 0.0, 1]
      ],
      [
        [this.radiustop, (4 / 3) * this.radiustop, this.height, 1],
        [this.radiusBase, (4 / 3) * this.radiusBase, 0.0, 1]
      ],
      [
        [this.radiustop, 0.0, this.height, 1],
        [this.radiusBase, 0.0, 0.0, 1]
      ]
    ];

    this.surface = new CGFnurbsSurface(3, 1, this.controlPoints);

    this.obj = new CGFnurbsObject(this.scene, this.slices / 2, this.stacks, this.surface);
  }

  display() {
    this.obj.display();
    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.obj.display();
    this.scene.popMatrix();
  };
}
