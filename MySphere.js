/**
* MySphere class, which represents a sphere object
*/
class MySphere extends CGFobject
{
	constructor(scene, radius, slices, stacks)
	{
		super(scene);
		this.radius = radius;
		this.slices = slices;
		this.stacks = stacks;
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		this.defaultTexCoords = [];
		this.initBuffers();
	};

	/**
	* Creates vertices, indices, normals and texCoords
	*/
	initBuffers(){

		var s = (2 * Math.PI) / this.slices;
		var l = (2 * Math.PI) / this.stacks;

		for (var i = 0; i <= this.stacks; i++) 
		{
			for (var j = 0; j <= this.slices; j++) 
			{

				this.vertices.push((this.radius * Math.cos(l * j)) * Math.cos(s * i), (this.radius * Math.cos(l * j)) * Math.sin(s * i), this.radius * Math.sin(s * j));

				this.normals.push((this.radius * Math.cos(l * j)) * Math.cos(s * i), (this.radius * Math.cos(l * j)) * Math.sin(s * i), this.radius * Math.sin(s * j));

				if(i != this.stacks && j != this.slices)
				{
					this.indices.push(j*(this.slices + 1) + i, j*(this.slices + 1) + i + this.slices + 1, j*(this.slices + 1) + i + this.slices + 2);
					this.indices.push(j*(this.slices + 1) + i, j*(this.slices + 1) + i + this.slices + 2, j*(this.slices + 1) + i + 1);
				}

				this.texCoords.push(1-i*(1/this.stacks), 1-j*(1/this.slices));
			}
		}

		//this.defaultTexCoords = this.texCoords;
		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	/**
	* Updates the torus's texCoords
	* @param {number} s represents the amount of times the texture will be repeated in the s coordinate
	* @param {number} t represents the amount of times the texture will be repeated in the t coordinate
	*/
	updateTexCoords(s,t){
		this.texCoords = this.defaultTexCoords.slice();

		for(var i = 0; i < this.texCoords.length; i+=2)
		{
			this.texCoords[i] /= s;
			this.texCoords[i+1] /= t;
		}

		this.updateTexCoordsGLBuffers();
	};

};
