/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);

		this.inner = inner
		this.outer = outer
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		for (var i = 0; i <= this.loops; i++) {
			var l = i * 2 * Math.PI / this.loops;

			for (var j = 0; j <= this.slices; j++) {
				var s = j * 2 * Math.PI / this.slices;

				this.vertices.push((this.outer + (this.inner * Math.cos(l))) * Math.cos(s), (this.outer + (this.inner * Math.cos(l))) * Math.sin(s), this.inner * Math.sin(l));
				this.normals.push((this.outer + (this.inner * Math.cos(l))) * Math.cos(s), (this.outer + (this.inner * Math.cos(l))) * Math.sin(s), this.inner * Math.sin(l));
				this.texCoords.push(1 - (j / this.slices), 1 - (i / this.loops));

				if(i != this.loops && j != this.slices){
					this.indices.push((i * (this.slices + 1)) + j, (i * (this.slices + 1)) + j + this.slices + 1 + 1, (i * (this.slices + 1)) + j + this.slices + 1);
					this.indices.push((i * (this.slices + 1)) + j, (i * (this.slices + 1)) + j + 1, (i * (this.slices + 1)) + j + this.slices + 1 + 1);
				}
			}
			
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};