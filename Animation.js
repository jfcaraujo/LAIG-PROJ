class Animation {
    constructor(id) {
        this.id = id;
    }

    update(time) {

    }

    apply() {

    }
}

class KeyframeAnimation extends Animation {
    constructor(id, number, instant, translate, rotate, scale) {
        super(id);
        this.number = number;
        this.instant = instant;
        this.translate = translate;
        this.rotate = rotate;
        this.scale = scale;
    }
}