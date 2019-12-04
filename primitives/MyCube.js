/**
 * MyCube
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyCube extends CGFobject {
	constructor(scene,side) {
		super(scene);
		this.side= side;
		this.initBuffers();
	}
	initBuffers() {
		let x = this.side;
		this.vertices = [
			0,0,x,		//0 Front 
			0,x,x,	//1
			x,0,x,	//2
            x,x,x,	//3 
            0,0,0,			//4 Back
            0,x,0,		//5
            x,0,0,		//6
			x,x,0,	//7
			0,0,x,		//8 Left 
			0,x,x,    //9 
			0,0,0,			//10
			0,x,0,		//11
			0,x,x,	//12 Top
			x,x,x,	//13
			0,x,0,		//14
			x,x,0,	//15
			x,0,0,		//16 Right
			x,x,x,	//17
			x,0,x,	//18
			x,x,0,	//19
			0,0,0,			//20 Bottom
			x,0,x,	//21
			0,0,x,		//22
			x,0,0		//23
			];

		//Counter-clockwise reference of vertices
		this.indices = [
			2,1,0,    	// front 
            1,2,3,
            4,5,6,    	//back 
            7,6,5,
            8,9,10,    	//left 
            11,10,9,    
            12,13,14,    	//top 
            15,14,13,
            16,17,18,    	//right 
            17,16,19,
            20,21,22,    	//bottom 
            21,20,23
		];

		this.normals = [
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,1,
			0,0,-1,
			0,0,-1,
			0,0,-1,
			0,0,-1,
			-1,0,0,
			-1,0,0,
			-1,0,0,
			-1,0,0,
			0,1,0,
			0,1,0,
			0,1,0,
			0,1,0,
			1,0,0,
			1,0,0,
			1,0,0,
			1,0,0,
			0,-1,0,
			0,-1,0,
			0,-1,0,
			0,-1,0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
}

