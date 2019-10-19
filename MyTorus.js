/**
 * MyTorus
 * @constructor
 */
class MyTorus extends CGFobject {
	constructor(scene, id, inner, outer, slices, loops) {
		super(scene);

		this.inner = inner;
		this.outer = outer;
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

				this.vertices.push((this.outer + this.inner * Math.cos(s)) * Math.cos(l), (this.outer + this.inner * Math.cos(s)) * Math.sin(l), this.inner * Math.sin(s));
				this.normals.push((this.inner * Math.cos(s)) * Math.cos(l), (this.inner * Math.cos(s)) * Math.sin(l), this.inner * Math.sin(s));
				this.texCoords.push(1 - (j / this.slices), 1 - (i / this.loops));

				if (i != this.loops && j != this.slices) {
					this.indices.push((i * (this.slices + 1)) + j, (i * (this.slices + 1)) + j + this.slices + 1, (i * (this.slices + 1)) + j + 1);
					this.indices.push((i * (this.slices + 1)) + j + this.slices + 1, (i * (this.slices + 1)) + j + this.slices + 2, (i * (this.slices + 1)) + j + 1);
				}
			}

		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	updateTexCoords(s, t) { };
};
