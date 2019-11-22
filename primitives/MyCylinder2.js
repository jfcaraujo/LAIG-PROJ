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
           [-this.topRadius, 0.0, this.height, 1],
           [-this.baseRadius, 0.0, 0.0, 1] 
      ],
      [ 
          [-this.topRadius, (4/3)*this.topRadius, this.height, 1],
          [-this.baseRadius, (4/3)*this.baseRadius, 0.0, 1] 
      ],
      [ 
          [this.topRadius, (4/3)*this.topRadius, this.height, 1],
          [this.baseRadius, (4/3)*this.baseRadius, 0.0, 1] 
      ],
      [ 
          [this.topRadius, 0.0, this.height, 1],
          [this.baseRadius, 0.0, 0.0, 1]						 
      ]
  ];

  this.surface = new CGFnurbsSurface(3, 1, this.controlPoints);

  this.obj = new CGFnurbsObject(this.scene, this.slices/2, this.stacks/2, this.surface);
  }

  display()
	{   
        this.obj.display();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.obj.display();
        this.scene.popMatrix();
    };
}
