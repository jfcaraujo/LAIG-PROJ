/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
        this.removeFolder = function(name) {
            var folder = this.gui.__folders[name];
            if (!folder) {
                return;
            }
            folder.close();
            this.gui.__ul.removeChild(folder.domElement.parentNode);
            delete this.gui.__folders[name];
            this.gui.onResize();
        }
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        this.addGameOptions();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function() {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
        if (event.code == "KeyM")
            this.scene.graph.changeTexture();
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    addViews(views) {
        const folder = this.gui.addFolder("Views");
        folder.open();

        const cameraIdArray = Object.keys(views);
        this.currentCameraId = this.scene.graph.defaultCameraId;
        //this.securityCameraId = this.scene.graph.defaultCameraId;
        folder.add(this, 'currentCameraId', cameraIdArray).name('Camera');
        //folder.add(this, 'securityCameraId', cameraIdArray).name('Camera');
    }

    addLights(lights) {
        const folder = this.gui.addFolder("Lights");
        folder.open();
        let i = 0;
        for (let key in lights) {
            if (lights.hasOwnProperty(key)) {
                folder.add(this.scene.lights[i], 'enabled').name(key);
            }
            i++;
        }
    }

    addGameOptions() { //TODO add score and time
        const folder = this.gui.addFolder("Game Options");
        folder.open();
        folder.add(this.scene, 'intelligent').name('Intelligent AI');
        folder.add(this.scene, 'gameMode', this.scene.gameModes).name('Game Mode');
        folder.add(this.scene, 'gameScene', this.scene.gameScenes).name('Game Scene').onChange(this.scene.changeTheme.bind(this.scene));
        folder.add(this.scene, 'movie').name('Movie');
        folder.add(this.scene, 'undo').name('Undo');
        folder.add(this.scene, 'restart').name('Restart game!');
    }
}