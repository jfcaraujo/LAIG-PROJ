/**
 * MyTorus
 * @constructor
 */

class MyTorus extends CGFobject {
    constructor(scene, id, inner_r, outer_r, slices, loops) {
        super(scene);
        this.id = id;
        this.outer_r = outer_r;
        this.inner_r = inner_r;
        this.slices = slices;
        this.loops = loops;
        this.initBuffers();

    };

    initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.initTexCoords = [];
        this.texCoords = [];
        var s = 1 / this.loops;
        var t = 1 / this.slices;

        for (var stack_c = 0; stack_c <= this.loops; stack_c++) {
            var ang = stack_c * 2 * Math.PI / this.loops;

            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var phi = slice_c * 2 * Math.PI / this.slices;

                var x = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.cos(ang);
                var y = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.sin(ang);
                var z = this.inner_r * Math.sin(phi);

                this.vertices.push(x, y, z);

                this.normals.push(x - this.outer_r * Math.cos(ang), y - this.outer_r * Math.sin(ang), z);

                var factorS = stack_c * s;
                var factorT = slice_c * t;

                this.initTexCoords.push(factorS, factorT);

            }
        }

        for (var stack_c = 0; stack_c < this.loops; stack_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var first = (stack_c * (this.slices + 1)) + slice_c;
                var second = first + this.slices + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }


        this.texCoords = this.initTexCoords.slice();
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    updateTexCoords(s, t) {};
}