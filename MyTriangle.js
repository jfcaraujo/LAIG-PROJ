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
        this.defaultTexCoords = [];
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
            0, 1, 2, 0, 2, 1
        ];

        var V21 = vec3.create();  //vetor do ponto 1 ao ponto 2
        var V21 = [this.v2[0] - this.v1[0],
        this.v2[1] - this.v1[1],
        this.v2[2] - this.v1[2]];

        var V32 = vec3.create(); //vetor do ponto 2 ao ponto 3
        var V32 = [this.v3[0] - this.v2[0],
        this.v3[1] - this.v2[1],
        this.v3[2] - this.v3[2]];

        var N = vec3.create() //n - normal ao triangulo
        vec3.cross(N, V21, V32);
        vec3.normalize(N, N);

        this.normals = [
            N[0], N[1], N[2],
            N[0], N[1], N[2],
            N[0], N[1], N[2],
            -N[0], -N[1], -N[2],
            -N[0], -N[1], -N[2],
            -N[0], -N[1], -N[2]];

        var d1 = Math.sqrt(Math.pow(this.v2[0] - this.v1[0], 2) + Math.pow(this.v2[1] - this.v1[1], 2) + Math.pow(this.v2[2] - this.v1[2], 2));
        var d2 = Math.sqrt(Math.pow(this.v2[0] - this.v3[0], 2) + Math.pow(this.v2[1] - this.v3[1], 2) + Math.pow(this.v2[2] - this.v3[2], 2));
        var d3 = Math.sqrt(Math.pow(this.v1[0] - this.v3[0], 2) + Math.pow(this.v1[1] - this.v3[1], 2) + Math.pow(this.v1[2] - this.v3[2], 2));

        var angle = Math.acos((Math.pow(d2, 2) - Math.pow(d3, 2) + Math.pow(d1, 2)) / (2 * d2 * d1));

        var d = d2 * Math.sin(angle);

        this.texCoords = [
            0, d,
            d1, d,
            (d1 - d2 * Math.cos(angle)), (d - d2 * Math.sin(angle)),
            1, d,
            1 - d1, d,
            1 - (d1 - d2 * Math.cos(angle)), (d - d2 * Math.sin(angle))
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

    updateTexCoords(s, t) {
        //d1: 1-2
        //d2: 2-3
        //d3: 3-1


        var d1 = Math.sqrt(Math.pow(this.v2[0] - this.v1[0], 2) + Math.pow(this.v2[1] - this.v1[1], 2) + Math.pow(this.v2[2] - this.v1[2], 2));
        var d2 = Math.sqrt(Math.pow(this.v2[0] - this.v3[0], 2) + Math.pow(this.v2[1] - this.v3[1], 2) + Math.pow(this.v2[2] - this.v3[2], 2));
        var d3 = Math.sqrt(Math.pow(this.v1[0] - this.v3[0], 2) + Math.pow(this.v1[1] - this.v3[1], 2) + Math.pow(this.v1[2] - this.v3[2], 2));

        var angle = Math.acos((Math.pow(d2, 2) - Math.pow(d3, 2) + Math.pow(d1, 2)) / (2 * d2 * d1));

        var d = d2 * Math.sin(angle);

        this.texCoords = [
            0, d / t,
            d1 / s, d / t,
            (d1 - d2 * Math.cos(angle)) / s, (d - d2 * Math.sin(angle)) / t
        ];

        this.updateTexCoordsGLBuffers();
    };
};