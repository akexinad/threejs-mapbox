    mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';
    var origin = [11.331470, 43.318435, 20];
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
                const geo = new THREE.BoxGeometry(20, 20, 20);
                const mat = new THREE.MeshLambertMaterial({
                    color: "#d40000"
                });

                const mesh = new THREE.Mesh(geo, mat);
                mesh.castShadow = true;
                mesh.recieveShadow = true;
                return mesh
            }
            let cube2 = createCube();
            cube2 = tb.Object3D({obj: cube2})
                .setCoords([11.256720, 43.780050])
            
            tb.add(cube2);

            var geometry = new THREE.BoxGeometry(20, 20, 20);
            var redMaterial = new THREE.MeshLambertMaterial( {
                color: '#d40000', 
                // side: THREE.DoubleSide
            });

            var cube = new THREE.Mesh(geometry, redMaterial);
            cube = tb.Object3D({obj: cube})
                .setCoords(origin)
            
            
            tb.add(cube);
        },
        
        render: function(gl, matrix){
            tb.update();
        }
    });
});