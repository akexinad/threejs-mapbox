mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';
var map = window.map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    zoom: 15,
    center: [151.184089, -33.863516],
    pitch: 60,
    bearing: -17.6
});

// makes it easier to copy and paste inverted coords from google maps
const coords = [-33.861073, 151.186000]

// change the altitude and tower height simultaneously so the tower base stays pinned to the map.
const towerHeight = 100;

// parameters to ensure the tower is georeferenced correctly on the map
var towerOrigin = [coords[1], coords[0]]; 
var towerAltitude = towerHeight;
var towerRotate = [Math.PI / 2, 5, 0];
var towerScale = 5.41843220338983e-8;

// transformation parameters to position, rotate and scale the 3D tower onto the map
var towerTransform = {
    translateX: mapboxgl.MercatorCoordinate.fromLngLat(towerOrigin, towerAltitude).x,
    translateY: mapboxgl.MercatorCoordinate.fromLngLat(towerOrigin, towerAltitude).y,
    translateZ: mapboxgl.MercatorCoordinate.fromLngLat(towerOrigin, towerAltitude).z,
    rotateX: towerRotate[0],
    rotateY: towerRotate[1],
    rotateZ: towerRotate[2],
    scale: towerScale
};

var THREE = window.THREE;

// configuration of the custom layer for a 3D tower per the CustomLayerInterface
var customLayer = {
    id: '3d-tower',
    type: 'custom',
    renderingMode: '3d',
    onAdd: function(map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        // create two three.js lights to illuminate the tower
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();

        var directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();

        function createTower() {
            const geo = new THREE.BoxGeometry(30, towerHeight, 40); // width, height, depth
            const mat = new THREE.MeshLambertMaterial({
                color: "#D40000"
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.recieveShadow = true;
            return mesh;
        }
        
        const tower = createTower();

        this.scene.add(tower, directionalLight, directionalLight2);

        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl
        });

        this.renderer.autoClear = false;
    },
    render: function(gl, matrix) {
        var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), towerTransform.rotateX);
        var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), towerTransform.rotateY);
        var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), towerTransform.rotateZ);

        var m = new THREE.Matrix4().fromArray(matrix);
        var l = new THREE.Matrix4().makeTranslation(towerTransform.translateX, towerTransform.translateY, towerTransform.translateZ)
            .scale(new THREE.Vector3(towerTransform.scale, -towerTransform.scale, towerTransform.scale))
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

map.on('load', function() {
    map.addLayer(customLayer, 'waterway-label');

    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers;
 
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    // The 'building' layer in the mapbox-streets vector source contains building-height
    // data from OpenStreetMap.
    map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
            'fill-extrusion-color': '#778899',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"], 15, 0, 15.05, ["get", "min_height"]
            ],
                'fill-extrusion-opacity': .8
        }
    }, labelLayerId);
});