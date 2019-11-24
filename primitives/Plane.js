class MyPlane extends CGFobject {
    constructor(scene, u, v) {
        super(scene);
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        this.initBuffers(u + 1, v + 1);
    }

    initBuffers(u, v) {
        let x, y;
        const xdiff = 1.0 / (u - 1);
        const ydiff = 1.0 / (v - 1);
        for (y = 0; y < v; y++) {
            for (x = 0; x < u; x++) {
                this.vertices.push(xdiff * x, 0, ydiff * y);
                this.texCoords.push(xdiff * x, ydiff * y);
                if (x > 0 && y > 0) {
                    this.indices.push(u * y + x, u * (y - 1) + x - 1, u * y + x - 1);
                    this.indices.push(u * y + x, u * (y - 1) + x, u * (y - 1) + x - 1);
                }
                this.normals.push(0, 1, 0);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}