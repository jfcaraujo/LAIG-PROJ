const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const ANIMATIONS_INDEX = 7;
const PRIMITIVES_INDEX = 8;
const COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        const rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        const error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        const nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        const nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let error;

        // Processes each node, verifying errors.

        // <scene>
        let index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("All parsed");
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        const root = this.reader.getString(sceneNode, 'root');
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        const axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {
        let from;
        let to;
        let up;
        let cam;
        this.views = [];
        const children = viewsNode.children;
        let view;
        this.defaultCameraId = this.reader.getString(viewsNode, 'default');
        if (children.length == 0)
            this.onXMLError("No views found");
        for (let i = 0; i < children.length; i++) {
            view = children[i];
            const viewId = this.reader.getString(view, 'id');

            if (view.nodeName == 'perspective') {
                // near
                var near = this.reader.getFloat(view, 'near');
                if (!(near != null && !isNaN(near)))
                    return "unable to parse near of the view for ID = " + viewId;
                // far
                var far = this.reader.getFloat(view, 'far');
                if (!(far != null && !isNaN(far)))
                    return "unable to parse far of the view for ID = " + viewId;
                // angle
                const angle = this.reader.getFloat(view, 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the view for ID = " + viewId;

                var viewchildren = view.children;
                //from
                if (viewchildren[0].nodeName != "from")
                    return "unable to parse from of the view for ID = " + viewId;
                from = this.parseCoordinates3D(viewchildren[0], "from of the view for ID = " + viewId);
                //to
                if (viewchildren[1].nodeName != "to")
                    return "unable to parse to of the view for ID = " + viewId;
                to = this.parseCoordinates3D(viewchildren[1], "to of the view for ID = " + viewId);
                cam = new CGFcamera(angle * DEGREE_TO_RAD, near, far, from, to);
                this.views[viewId] = cam;
            } else if (view.nodeName == 'ortho') {
                // near
                var near = this.reader.getFloat(view, 'near');
                if (!(near != null && !isNaN(near)))
                    return "unable to parse near of the view for ID = " + viewId;
                // far
                var far = this.reader.getFloat(view, 'far');
                if (!(far != null && !isNaN(far)))
                    return "unable to parse far of the view for ID = " + viewId;
                //left
                const left = this.reader.getFloat(view, 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left of the view for ID = " + viewId;
                //right
                const right = this.reader.getFloat(view, 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right of the view for ID = " + viewId;
                //top
                let top = this.reader.getFloat(view, 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the view for ID = " + viewId;
                //bottom
                let bottom = this.reader.getFloat(view, 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom of the view for ID = " + viewId;

                var viewchildren = view.children;
                //from
                if (viewchildren[0].nodeName != "from")
                    return "unable to parse from of the view for ID = " + viewId;
                from = this.parseCoordinates3D(viewchildren[0], "from of the view for ID = " + viewId);
                //to
                if (viewchildren[1].nodeName != "to")
                    return "unable to parse to of the view for ID = " + viewId;
                to = this.parseCoordinates3D(viewchildren[1], "to of the view for ID = " + viewId);
                //up
                if (viewchildren.length == 3) {
                    if (viewchildren[1].nodeName != "up")
                        return "unable to parse up of the view for ID = " + viewId;
                    up = this.parseCoordinates3D(viewchildren[1], "up of the view for ID = " + viewId);
                } else {
                    up = [0, 1, 0];
                }

                cam = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
                this.views[viewId] = cam;

            } else this.onXMLError("View not identified");
        }
        this.log("Parsed views");
        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseAmbient(ambientsNode) {

        let children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        let nodeNames = [];

        for (let i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        let ambientIndex = nodeNames.indexOf("ambient");
        let backgroundIndex = nodeNames.indexOf("background");

        let color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        let children = lightsNode.children;

        this.lights = [];
        let numLights = 0;

        let grandChildren = [];
        let nodeNames = [];

        // Any number of lights.
        for (let i = 0; i < children.length; i++) {

            let j;
            // Storing light information
            const global = [];
            const attributeNames = [];
            const attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            const lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            let enableLight = true;
            let aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (j = 0; j < attributeNames.length; j++) {
                const attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") {
                        aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    } else {
                        aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);
                    }

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                } else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                const angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                const exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                const targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                let targetLight = [];
                if (targetIndex != -1) {
                    aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                } else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        this.textures = [];
        const children = texturesNode.children;
        if (children.length == 0)
            this.onXMLError("No textures found");
        for (let i = 0; i < children.length; i++) {
            const textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) {
                this.onXMLMinorError("Texture with null ID");
            }
            if (this.textures[textureID] != null) {
                this.onXMLMinorError("Texture with ID" + textureID + "already in use");
            }
            const textureFile = this.reader.getString(children[i], 'file');
            if (textureFile == null) {
                this.onXMLMinorError("Texture with null filepath");
            }
            const tex = new CGFtexture(this.scene, textureFile);
            this.textures[textureID] = tex;
        }
        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        const children = materialsNode.children;

        this.materials = [];

        if (children.length == 0)
            this.onXMLError("No materials found");
        // Any number of materials.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            const materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";


            const shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse shininess of the material for ID = " + materialID;

            const grandChildren = children[i].children;
            if (grandChildren[0].nodeName != "emission" || grandChildren[1].nodeName != "ambient" || grandChildren[2].nodeName != "diffuse" || grandChildren[3].nodeName != "specular")
                return "Material with ID = " + materialID + "has wrong children components ";
            const emission = this.parseColor(grandChildren[0], "emission of the material with ID = " + materialID);
            const ambient = this.parseColor(grandChildren[1], "ambient of the material with ID = " + materialID);
            const diffuse = this.parseColor(grandChildren[2], "diffuse of the material with ID = " + materialID);
            const specular = this.parseColor(grandChildren[3], "specular of the material with ID = " + materialID);

            const material = new CGFappearance(this.scene);
            material.setTextureWrap("REPEAT", "REPEAT");
            material.setShininess(shininess);
            material.setEmission(emission[0], emission[1], emission[2], emission[3]);
            material.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            material.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            material.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        const children = transformationsNode.children;

        if (children.length == 0)
            this.onXMLError("No transformations found");

        this.transformations = [];

        let grandChildren = [];

        // Any number of transformations.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            const transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            if (grandChildren.length == 0)
                this.onXMLError("No transformations found for transformation " + transformationID);

            this.transformations[transformationID] = this.parseTransformationsAux(grandChildren);
        }
        this.log("Parsed transformations");
        return null;
    }

    parseTransformationsAux(grandChildren) {
        let transfMatrix = mat4.create();

        for (let j = 0; j < grandChildren.length; j++) {
            var coordinates;
            switch (grandChildren[j].nodeName) {
                case 'translate':
                    coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation");
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'scale':
                    coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation");
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'rotate':
                    const axis = this.reader.getString(grandChildren[j], 'axis');
                    if (axis == null || axis.length != 1)
                        return "unable to parse axis of the rotation";
                    let angle = this.reader.getFloat(grandChildren[j], 'angle');
                    if (angle == null || isNaN(angle))
                        return "unable to parse angle of the rotation";
                    angle = angle * DEGREE_TO_RAD;

                    switch (axis) {
                        case 'x':
                            transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle);
                            break;
                        case 'y':
                            transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle);
                            break;
                        case 'z':
                            transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle);
                            break;
                        default:
                            return "unable to parse axis of the rotation";
                    }
                    break;
                default:
                    this.onXMLError("The transformation must be one of three types (translate, rotate, scale).");

            }
        }
        return transfMatrix;

    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        const children = primitivesNode.children;

        if (children.length == 0)
            this.onXMLError("No primitives found");

        this.primitives = [];

        let grandChildren = [];

        // Any number of primitives.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            const primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' &&
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch or cylinder2)"
            }

            // Specifications for the current primitive.
            const primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                const x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                const y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                const x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                const y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                const rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            } else if (primitiveType == 'triangle') {
                // x1
                const x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                const y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                const z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                const x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                const y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                const z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                const x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                const y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                const z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;
                const triangle = new MyTriangle(this.scene, primitiveId, x1, y1, z1, x2, y2, z2, x3, y3, z3);
                this.primitives[primitiveId] = triangle;
            } else if (primitiveType == 'cylinder') {
                // slices
                const slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                const stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                //height
                const height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                //baseRadius
                const baseRadius = this.reader.getFloat(grandChildren[0], 'base');
                if (!(baseRadius != null && !isNaN(baseRadius)))
                    return "unable to parse baseRadius of the primitive coordinates for ID = " + primitiveId;

                //topRadius
                const topRadius = this.reader.getFloat(grandChildren[0], 'top');
                if (!(topRadius != null && !isNaN(topRadius)))
                    return "unable to parse topRadius of the primitive coordinates for ID = " + primitiveId;

                const cylinder = new MyCylinder(this.scene, primitiveId, slices, stacks, height, baseRadius, topRadius);

                this.primitives[primitiveId] = cylinder;
            } else if (primitiveType == 'sphere') {
                // slices
                const slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                const stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                //radius
                const radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                const sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            } else if (primitiveType == 'torus') {
                //inner radius
                const inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner radius of the primitive coordinates for ID = " + primitiveId;
                //outer radius
                const outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer radius of the primitive coordinates for ID = " + primitiveId;
                // slices
                const slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;
                //loops
                const loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                const torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);
                this.primitives[primitiveId] = torus;
            } else if (primitiveType == 'plane') {
                // npartsU
                const npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                const npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                let plane = new MyPlane(this.scene, primitiveId, npartsU, npartsV);
                this.primitives[primitiveId] = plane;

            } else if (primitiveType == 'patch') {
                let patch = grandChildren[0];
                // npointsU
                const npointsU = this.reader.getInteger(patch, 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npointsV
                const npointsV = this.reader.getInteger(patch, 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                // npartsU
                const npartsU = this.reader.getInteger(patch, 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU)))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                // npartsV
                const npartsV = this.reader.getInteger(patch, 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV)))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                let points = [];
                for (let i = 0; i < npointsU * npointsV; i++) {
                    // xx
                    const xx = this.reader.getFloat(patch[i], 'xx');
                    if (!(xx != null && !isNaN(xx)))
                        return "unable to parse xx of the primitive coordinates for ID = " + primitiveId;

                    // yy
                    const yy = this.reader.getFloat(patch[i], 'yy');
                    if (!(yy != null && !isNaN(yy)))
                        return "unable to parse yy of the primitive coordinates for ID = " + primitiveId;

                    // zz
                    const zz = this.reader.getFloat(patch[i], 'zz');
                    if (!(zz != null && !isNaN(zz)))
                        return "unable to parse zz of the primitive coordinates for ID = " + primitiveId;

                    const point = [xx, yy, zz];
                    points.push(point);
                }

                let newPatch = new Patch(this.scene, primitiveId, npointsU, npointsV, npartsU, npartsV, points);
                this.primitives[primitiveId] = newPatch;
            } else if (primitiveType == 'cylinder2') {
                // slices
                const slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                const stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                //height
                const height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                //baseRadius
                const baseRadius = this.reader.getFloat(grandChildren[0], 'base');
                if (!(baseRadius != null && !isNaN(baseRadius)))
                    return "unable to parse baseRadius of the primitive coordinates for ID = " + primitiveId;

                //topRadius
                const topRadius = this.reader.getFloat(grandChildren[0], 'top');
                if (!(topRadius != null && !isNaN(topRadius)))
                    return "unable to parse topRadius of the primitive coordinates for ID = " + primitiveId;

                const cylinder = new MyCylinder2(this.scene, primitiveId, slices, stacks, height, baseRadius, topRadius);

                this.primitives[primitiveId] = cylinder;
            } else {
                console.warn("Unable to identify primitive.");
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {

        const children = animationsNode.children;
        this.animations = [];
        let grandChildren = [];

        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            const animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            grandChildren = children[i].children;
            let keyframes = [];
            for (let x = 0; x < grandChildren.length; x++) {
                keyframes.push(this.parseKeyframe(grandChildren[x]));
            }
            this.animations[animationId] = new KeyframeAnimation(this.scene, keyframes);
        }
    }

    parseKeyframe(keyframeNode) {
        if (keyframeNode.nodeName != "keyframe") {
            this.onXMLMinorError("unknown tag <" + keyframeNode.nodeName + ">");
            return null;
        }

        let instant = this.reader.getFloat(keyframeNode, 'instant');
        if (instant == null)
            this.onXMLMinorError("no instant defined for keyframe");
        instant *= 1000;

        let children = keyframeNode.children;
        let translation = this.parseCoordinates3D(children[0], "translate animation");
        if (!Array.isArray(translation))
            this.onXMLMinorError("unable to parse translation in animation");
        let scale = this.parseCoordinates3D(children[2], "scale animation");
        if (!Array.isArray(scale))
            this.onXMLMinorError("unable to parse scale in animation");

        //rotation
        const rotation = [];

        let x = this.reader.getFloat(children[1], 'angle_x');
        if (!(x != null && !isNaN(x)))
            this.onXMLMinorError("unable to parse angle_x in animation");

        let y = this.reader.getFloat(children[1], 'angle_y');
        if (!(y != null && !isNaN(y)))
            this.onXMLMinorError("unable to parse angle_y in animation");

        let z = this.reader.getFloat(children[1], 'angle_z');
        if (!(z != null && !isNaN(z)))
            this.onXMLMinorError("unable to parse angle_z in animation");
        x *= DEGREE_TO_RAD;
        y *= DEGREE_TO_RAD;
        z *= DEGREE_TO_RAD;
        rotation.push(...[x, y, z]);

        return new Keyframe(instant, translation, rotation, scale);
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        let childID;
        let transformation;
        const children = componentsNode.children;

        this.components = [];

        let grandChildren = [];
        let grandgrandChildren = [];
        let nodeNames = [];

        // Any number of components.
        for (let i = 0; i < children.length; i++) {

            let x;
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            const componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            const transformationIndex = nodeNames.indexOf("transformation");
            const animationIndex = nodeNames.indexOf("animationref");
            const materialsIndex = nodeNames.indexOf("materials");
            const textureIndex = nodeNames.indexOf("texture");
            const childrenIndex = nodeNames.indexOf("children");

            // Transformations
            if (transformationIndex != 0) this.onXMLError("Transformations for component " + componentID + " not found");
            if (grandChildren[transformationIndex].children.length == 0) {
                transformation = mat4.create();
                //transformation = mat4.translate(transformation, transformation, [0, 0, 0]);
            } else if (grandChildren[transformationIndex].children[0].nodeName == 'transformationref') {
                const id = this.reader.getString(grandChildren[transformationIndex].children[0], 'id');
                if (this.transformations[id] != null) {
                    transformation = this.transformations[id];
                } else
                    this.onXMLMinorError("No trasformation for ID : " + id);
            } else {
                transformation = this.parseTransformationsAux(grandChildren[transformationIndex].children);
            }

            //Animation
            let animationID = null;
            if (animationIndex == 1) {
                animationID = this.reader.getString(grandChildren[animationIndex], 'id');
                if (this.animations[animationID] == null) {
                    this.onXMLMinorError("No animation for ID : " + animationID);
                }

            }

            // Materials
            if (materialsIndex != 1 && materialsIndex != 2) this.onXMLError("Material for component " + componentID + " not found");
            const materialID = [];
            for (x = 0; x < grandChildren[materialsIndex].children.length; x++) {
                materialID[x] = this.reader.getString(grandChildren[materialsIndex].children[x], 'id');
                if (materialID[x] != "inherit" && this.materials[materialID[x]] == null) {
                    this.onXMLMinorError("No material for ID : " + materialID[x]);
                }
            }
            // Texture
            if (textureIndex != 2 && textureIndex != 3) this.onXMLError("Texture for component " + componentID + " not found");
            const textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (textureID != "none" && textureID != "inherit" && this.textures[textureID] == null) {
                this.onXMLMinorError("No texture for ID : " + textureID);
            }
            const textureLenghtS = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false);
            const textureLenghtT = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false);

            // Children
            if (childrenIndex != 3 && childrenIndex != 4) this.onXMLError("Children for component " + componentID + " not found");

            grandgrandChildren = grandChildren[childrenIndex].children;
            const leaves = [];
            const componentchildren = [];
            for (x = 0; x < grandgrandChildren.length; x++) {
                if (grandgrandChildren[x].nodeName == "componentref") {
                    childID = this.reader.getString(grandgrandChildren[x], 'id');
                    componentchildren.push(childID);
                } else if (grandgrandChildren[x].nodeName == "primitiveref") {
                    childID = this.reader.getString(grandgrandChildren[x], 'id');
                    if (this.primitives[childID] == null)
                        this.onXMLMinorError("No primitive for ID : " + childID);
                    leaves.push(childID);
                } else {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[x].nodeName + ">");
                }
            }
            const component = new MyComponent(this.scene, componentID, transformation, materialID, textureID, textureLenghtS, textureLenghtT, componentchildren, leaves, animationID);
            this.components[componentID] = component;
        }
        this.log("Parsed components");
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        const position = [];

        // x
        const x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        const y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        const z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        let position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        const w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        const color = [];

        // R
        const r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        const g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        const b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        const a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.displayComponent(this.idRoot, null, null, 1, 1);
    }

    displayComponent(componentID, material, texture, s, t) {
        let i;
        if (this.components[componentID] == null)
            this.onXMLMinorError("No component for ID : " + componentID);
        const component = this.components[componentID];
        this.scene.pushMatrix();
        this.scene.multMatrix(component.transformation);

        if (component.animationID != null)
            this.animations[component.animationID].apply();

        if (component.currentMaterialID != 'inherit')
            material = this.materials[component.currentMaterialID];

        if (component.texture == 'inherit') {
            material.setTexture(this.textures[texture]);
            component.length_s = s;
            component.length_t = t;
        } else if (component.texture == 'none')
            material.setTexture(null);
        else {
            texture = component.texture;
            material.setTexture(this.textures[texture]);
        }
        material.apply();
        material.setTexture(null);

        for (i in component.leaves) {
            if (component.length_s == null || component.length_t == null)
                this.primitives[component.leaves[i]].updateTexCoords(1, 1);
            else
                this.primitives[component.leaves[i]].updateTexCoords(component.length_s, component.length_t);
            this.primitives[component.leaves[i]].display();
        }
        for (i in component.children)
            this.displayComponent(component.children[i], material, texture, s, t);
        this.scene.popMatrix();
    }

    changeTexture() {
        for (let i in this.components)
            this.components[i].updateMaterial();
    }

}