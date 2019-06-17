mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';

var origin = [11.331470, 43.318435];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: origin,
    zoom: 10,
    pitch: 60,
    bearing: 80
});

map.on('style.load', function() {
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        onAdd: function(map, mbxContext){
            tb = new Threebox(
                map, 
                mbxContext,
                {defaultLights: true}
            );

            // initialize geometry and material of our cube object
            function createCube() {
                const geo = new THREE.BoxGeometry(200, 200, 200);
                const mat = new THREE.MeshLambertMaterial({
                    color: "#d40000"
                });

                const mesh = new THREE.Mesh(geo, mat);
                mesh.castShadow = true;
                mesh.recieveShadow = true;
                return mesh
            }

            var geometry = new THREE.BoxGeometry(200, 200, 200);
            var redMaterial = new THREE.MeshPhongMaterial( {
                color: '#d40000', 
            });

            var cube = new THREE.Mesh(geometry, redMaterial);
            cube = tb.Object3D({
                obj: cube,
                units: 'meters'
            }).setCoords(origin)
            
            tb.add(cube);
        },
        
        render: function(gl, matrix){
            tb.update();
        }
    });
});