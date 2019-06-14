mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';
var map = window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 17.5,
    center: [151.184089, -33.863516],
    pitch: 60
});

// =========================================== //
// BUILDING A RECTANGLE USING THESE PARAMETERS //
// =========================================== //

// makes it easier to copy and paste inverted coords from google maps
const coords = [-33.861073, 151.186000]

// parameters to ensure the model is georeferenced correctly on the map
var modelOrigin = [coords[1], coords[0]]; 
var modelAltitude = 50;
var modelRotate = [Math.PI / 2, 5, 0];
var modelScale = 5.41843220338983e-8;

// transformation parameters to position, rotate and scale the 3D model onto the map
var modelTransform = {
    translateX: mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude).x,
    translateY: mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude).y,
    translateZ: mapboxgl.MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude).z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelScale
};

var THREE = window.THREE;

// configuration of the custom layer for a 3D model per the CustomLayerInterface
var customLayer = {
    id: '3d-model',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // create two three.js lights to illuminate the model
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();

        // var directionalLight2 = new THREE.DirectionalLight(0xffffff);
        // directionalLight2.position.set(0, 70, 100).normalize();

        function createTower() {
            const geo = new THREE.BoxGeometry(30, 50, 40); // width, height, depth
            const mat = new THREE.MeshLambertMaterial({
                color: "#D40000"
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.recieveShadow = true;
            return mesh;
        }
        
        const tower = createTower();

        this.scene.add(tower, directionalLight);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        var loader = new THREE.GLTFLoader();
        loader.load('https://docs.mapbox.com/mapbox-gl-js/assets/34M_17/34M_17.gltf', (function (gltf) {
            this.scene.add(gltf.scene);
        }).bind(this));
        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl
        });

        this.renderer.autoClear = false;
    },
    render: function(gl, matrix) {
        var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
        var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
        var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

        var m = new THREE.Matrix4().fromArray(matrix);
        var l = new THREE.Matrix4().makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
            .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

        this.camera.projectionMatrix.elements = matrix;
        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
    }
};

map.on('style.load', function() {
    map.addLayer(customLayer, 'waterway-label');
});