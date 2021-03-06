/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;
        this.intelligent = true;
        this.gameModes = {
            'Player vs Player': 0,
            'Player vs Pc': 1,
            'Pc vs Pc': 2
        }
        this.gameMode = 0;
        this.gameScene = "demo.xml";
        this.gameScenes = {
            'Default': "demo.xml",
            'The Other Side': "demo2.xml",
        }
        this.restart = function() {
            if (!this.animating) {
                if (this.gameOrchestrator.player == 2)
                    this.rotateCamera();
                this.gameOrchestrator.restart();
            }
        }

        this.undo = function() {
            this.gameOrchestrator.undo();
        }

        this.movie = function() {
            if (!this.animating && this.gameOrchestrator.gameSequence.moves.length > 0) {
                this.interface.currentCameraId = Object.keys(this.graph.views)[1];
                this.animating = true;
                this.moviePlaying = true;
                this.gameOrchestrator.movie();
            }
        }

        this.angle = 0;
        this.animating = false;
        this.moviePlaying = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.firstTime = true;
        this.setPickEnabled(true);
        this.gameOrchestrator = new MyGameOrchestrator(this);
        //this.textureRTT = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        //this.securityCamera = new MySecurityCamera(this);

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (let key in this.graph.lights) {
            if (i >= 8)
                break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                const light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                this.lights[i].disable();
                this.lights[i].update();

                i++;
            }
        }
        this.lights[0].enable();
    }

    initViews() {
        this.camera = this.graph.views[this.graph.defaultCameraId];
        //this.interface.setActiveCamera(this.camera);
    }

    selectView(id) {
        this.camera = this.graph.views[id];
        if (id != this.graph.defaultCameraId)
            this.interface.setActiveCamera(this.camera);
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);

    }

    /** Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        this.initViews();

        this.interface.removeFolder("Lights");
        this.interface.removeFolder("Views");

        this.interface.addLights(this.graph.lights);

        this.interface.addViews(this.graph.views);

        this.sceneInited = true;

        if (this.firstTime) {
            this.restart();
            this.firstTime = false;
        }
    }

    display() {
            if (this.sceneInited) {
                this.gameOrchestrator.orchestrate();
                this.gameOrchestrator.managePick(this.pickResults);
                this.clearPickRegistration();
                /* this.textureRTT.attachToFrameBuffer();
                 this.render(this.interface.securityCameraId);
                 this.textureRTT.detachFromFrameBuffer();*/
                this.render(this.interface.currentCameraId);

                /* this.gl.disable(this.gl.DEPTH_TEST);
                 this.securityCamera.display();
                 this.gl.enable(this.gl.DEPTH_TEST);*/
                this.gameOrchestrator.display();
            }
        }
        /**
         * Renders the scene.
         */
    render(Camera) {
        // ---- BEGIN Background, camera and axis setup
        this.selectView(Camera);

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        //this.axis.display();

        for (let i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            this.gameOrchestrator.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    update(t) {
        if (!this.time) {
            this.time = t;
            return;
        }
        const time = t - this.time;
        //this.securityCamera.shader.setUniformsValues({ timeFactor: time });

        if (this.sceneInited) {
            for (let key in this.graph.animations)
                this.graph.animations[key].update(time);
            this.gameOrchestrator.orchestrate();
            this.gameOrchestrator.update(t);
        }
        if (this.animating && !this.moviePlaying) {
            this.graph.views[this.graph.defaultCameraId].orbit([0, 1, 0], Math.PI / 35.0);
            this.angle += Math.PI / 35.0;
            if (this.angle >= Math.PI) {
                this.angle -= Math.PI;
                this.animating = false;
            }
        }

    }

    changeTheme(theme) {
        this.gameOrchestrator.changeTheme(theme);
        this.angle = 0;
        this.sceneInited = false;
        this.time = null;
        if (this.gameOrchestrator.player == 1 && this.gameOrchestrator.animator.animating)
            this.rotateCamera();
        else if (this.gameOrchestrator.player == 2 && !this.gameOrchestrator.animator.animating)
            this.rotateCamera();
        else this.animating = false;
    }

    rotateCamera() {
        this.animating = true;
    }
}