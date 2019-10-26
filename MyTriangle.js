/**
 * MyTriangle class, representing the triangle.
 */
class MyTriangle extends CGFobject {
    /* 
        @constructor
     */
    constructor(scene, id, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        super(scene);

        this.id = id;
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

        this.v1 = vec3.fromValues(x1, y1, z1);
        this.v2 = vec3.fromValues(x2, y2, z2);
        this.v3 = vec3.fromValues(x3, y3, z3);

        this.initBuffers();
    };


    initBuffers() {
        this.vertices =
            [
                this.v1[0], this.v1[1], this.v1[2],
                this.v2[0], this.v2[1], this.v2[2],
                this.v3[0], this.v3[1], this.v3[2],
                this.v1[0], this.v1[1], this.v1[2],
                this.v2[0], this.v2[1], this.v2[2],
                this.v3[0], this.v3[1], this.v3[2]

            ];

        this.indices = [
            0, 1, 2,
            0, 2, 1
        ];

        var n1 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
        var n2 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];

        var nx = n1[1] * n2[2] - n1[2] * n2[1];
        var ny = n1[2] * n2[0] - n1[0] * n2[2];
        var nz = n1[0] * n2[1] - n1[1] * n2[0];


        this.normals = [
            nx, ny, nz,
            nx, ny, nz,
            nx, ny, nz,
            -nx, -ny, -nz,
            -nx, -ny, -nz,
            -nx, -ny, -nz];

        this.a = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2) + Math.pow((this.z2 - this.z1), 2));
        this.b = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2) + Math.pow((this.z3 - this.z2), 2));
        this.c = Math.sqrt(Math.pow((this.x1 - this.x3), 2) + Math.pow((this.y1 - this.y3), 2) + Math.pow((this.z1 - this.z3), 2));

        this.cos_a = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);
        this.sin_a = Math.sqrt(1 - Math.pow(this.cos_a, 2));



        this.texCoords = [
            0, 0,
            this.a, 0,//1,0
            this.c * this.cos_a, this.c * this.sin_a,//this.c*this.cos_a,1
            1, 0,
            1 - this.a, 0,
            1 - this.c * this.cos_a, this.c * this.sin_a
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    updateTexCoords(s, t) {

        this.texCoords = [
            0, 0,
            this.a / s, 0,
            this.c * this.cos_a / s, this.c * this.sin_a / t,
            1, 0,
            1 - this.a / s, 0,
            1 - this.c * this.cos_a / s, this.c * this.sin_a / t
        ];

        this.updateTexCoordsGLBuffers();
    };
};