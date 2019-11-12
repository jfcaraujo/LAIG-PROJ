class Animation {
    constructor(scene) {
        this.scene = scene;
    }

    update(time) {
    }

    apply() {
    }
}

class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super(scene);
        this.keyframes = keyframes;
        this.currentTransformation = mat4.create();
        this.keyframeIndex = 0;
    }

    update(time) {
        let currentKeyframe, previousKeyframe;
        while (this.keyframeIndex < this.keyframes.length) {
            currentKeyframe = this.keyframes[this.keyframeIndex];
            if (this.keyframeIndex == 0)
                previousKeyframe = new Keyframe(0, [0, 0, 0], [0, 0, 0], [1, 1, 1]);
            else previousKeyframe = this.keyframes[this.keyframeIndex - 1];

            if (currentKeyframe.instant > time)
                break;
            else this.keyframeIndex++;
        }
        this.currentTransformation = mat4.create();
        if (this.keyframeIndex < this.keyframes.length) {
            let times = [previousKeyframe.instant, currentKeyframe.instant, time];
            let translate = interpolate(times, previousKeyframe.translate, currentKeyframe.translate);
            let rotate = interpolate(times, previousKeyframe.rotate, currentKeyframe.rotate);
            let scale = interpolate(times, previousKeyframe.scale, currentKeyframe.scale);
            mat4.translate(this.currentTransformation, this.currentTransformation, translate);
            mat4.rotateX(this.currentTransformation, this.currentTransformation, rotate[0]);
            mat4.rotateY(this.currentTransformation, this.currentTransformation, rotate[1]);
            mat4.rotateZ(this.currentTransformation, this.currentTransformation, rotate[2]);
            mat4.scale(this.currentTransformation, this.currentTransformation, scale);
        }
        else {
            currentKeyframe = this.keyframes[this.keyframeIndex-1];
            mat4.translate(this.currentTransformation, this.currentTransformation, currentKeyframe.translate);
            mat4.rotateX(this.currentTransformation, this.currentTransformation, currentKeyframe.rotate[0]);
            mat4.rotateY(this.currentTransformation, this.currentTransformation, currentKeyframe.rotate[1]);
            mat4.rotateZ(this.currentTransformation, this.currentTransformation, currentKeyframe.rotate[2]);
            mat4.scale(this.currentTransformation, this.currentTransformation, currentKeyframe.scale);
        }

    }

    apply() {
        this.scene.multMatrix(this.currentTransformation);
    }

}

function interpolate(times, val1, val2) {
    let time1 = times[0];
    let time2 = times[1];
    let currentTime = times[2];
    let answer = [];
    answer[0] = val1[0] + (val2[0] - val1[0]) * (currentTime - time1) / (time2 - time1);
    answer[1] = val1[1] + (val2[1] - val1[1]) * (currentTime - time1) / (time2 - time1);
    answer[2] = val1[2] + (val2[2] - val1[2]) * (currentTime - time1) / (time2 - time1);
    return answer;
}


class Keyframe {
    constructor(instant, translate, rotate, scale) {
        this.instant = instant;
        this.translate = translate;
        this.rotate = rotate;
        this.scale = scale;
    }
}