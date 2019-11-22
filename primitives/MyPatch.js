class MyPatch extends CGFobject {

    constructor(scene, pointsU, pointsV, partsU, partsV,controlPoints) {
        super(scene);

        this.pointsU=pointsU;
        this.pointsV=pointsV;
        this.partsU=partsU;
        this.partsV=partsV;
        this.controlPoints=controlPoints;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.initBuffers();
    }

    initBuffers() {

        this.controlPointsAux = [];

        for(var i = 0; i < this.pointsU; i ++){
            var point = [];
            for(var j = 0; j < this.pointsV; j ++){
                point.push([
                        this.controlPoints[i*this.pointsV+j][0], 
                        this.controlPoints[i*this.pointsV+j][1], 
                        this.controlPoints[i*this.pointsV+j][2], 
                        this.controlPoints[i*this.pointsV+j][3]]);// ou 1
            }
            this.controlPointsAux.push(point);
        }

        this.surface = new CGFnurbsSurface(this.pointsU-1, this.pointsV-1, this.controlPointsAux);

        this.obj = new CGFnurbsObject(this.scene, this.partsU, this.partsV, this.surface);
      
    }

    display(){
        this.obj.display();
    }

    updateTexCoords(s,t){
	};
}