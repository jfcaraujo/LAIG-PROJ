class MyPlane extends CGFobject {
    constructor(scene, u, v) {
        super(scene);
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.initBuffers(u, v);
    }

    initBuffers(u, v) {
        let x, y;
        const xdiff = 1.0 / u;
        const ydiff = 1.0 / v;
        for (x = 0; x < u; x++) {
            for (y = 0; y < v; y++) {
                this.vertices.push(xdiff * x, ydiff * y);
                if (x > 0 && y > 0) {
                    this.indices.push(v*(y-1)+x-1,v*(y-1)+x,v*y+x);
                    this.indices.push(v*(y-1)+x-1,v*y+x,v*y+x-1);
                }
                this.normals.push(0,1,0);
            }
        }
    }
}