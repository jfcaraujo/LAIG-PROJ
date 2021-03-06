//From https://github.com/EvanHahn/ScriptInclude
include = function() {
    function f() {
        const a = this.readyState;
        (!a || /ded|te/.test(a)) && (c--, !c && e && d())
    }

    var a = arguments,
        b = document,
        c = a.length,
        d = a[c - 1],
        e = d.call;
    e && c--;
    let g,
        h = 0;
    for (; c > h; h++) g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)
};
serialInclude = function(a) {
    const b = console,
        c = serialInclude.l;
    if (a.length > 0) c.splice(0, 0, a);
    else b.log("Done!");
    if (c.length > 0) {
        if (c[0].length > 1) {
            const d = c[0].splice(0, 1);
            b.log("Loading " + d + "...");
            include(d, function() {
                serialInclude([]);
            });
        } else {
            const e = c[0][0];
            c.splice(0, 1);
            e.call();
        }
    } else b.log("Finished.");
};
serialInclude.l = [];

function getUrlVars() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function(m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'primitives/MyRectangle.js', 'primitives/MyTriangle.js', 'primitives/MyTorus.js', 'primitives/MySphere.js', 'primitives/MyCylinder.js', 'MyComponent.js',
    'Animation.js', 'MySecurityCamera.js', 'primitives/MyPatch.js', 'primitives/MyCylinder2.js', 'primitives/MyPlane.js',
    'primitives/MyCube.js', 'primitives/MyCone.js', 'MyGameOrchestrator.js', 'MyGameSequence.js', 'MyGameBoard.js', 'MyAnimator.js', 'MyPiece.js', 'MyGameMove.js', 'MyTile.js', 'MyPrologInterface.js',

    main = function() {
        // Standard application, scene and interface setup
        const app = new CGFapplication(document.body);
        const myInterface = new MyInterface();
        const myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml
        // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor)

        //const filename = getUrlVars()['file'] || "demo.xml";

        // create and load graph, and associate it to scene.
        // Check console for loading errors
        //const myGraph = new MySceneGraph(filename, myScene);

        // start
        app.run();
    }

]);