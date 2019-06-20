mapboxgl.accessToken = 'pk.eyJ1IjoiYWtleGluYWQiLCJhIjoiY2p0aWJ1b3d1MG53dzQzcGY1eGsyZmhlYSJ9.5M9Nprzz59r7--kUgE_BWA';

const coords = {
    origin: [11.319355, 43.328172],
    siena: [11.331470, 43.318435],
    leTolfe: [11.349175, 43.345444],
    monteriggioni: [11.249512, 43.348923],
    tognazza: [11.286397, 43.346272],
    coloniaSantaRegina: [11.366084, 43.321416],
    marcialla: [11.142095, 43.575049]
}


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: coords.origin,
    zoom: 13,
    pitch: 60,
    bearing: 0
});

map.on('style.load', function() {
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        onAdd: function(map, mbxContext){
            tb = new Threebox(
                map, 
                mbxContext,
                {defaultLights: false}
            );
            
            function rotate() {
                return {
                    rotation:
                    {
                        x: 0,
                        y: 0,
                        z: 180
                    }
                }
            }
            
            // Function that create and return the THREE mesh
            function createCube() {
                const geometry = new THREE.BoxGeometry(300, 300, 300);
                const material = new THREE.MeshLambertMaterial({
                    color: "#BADA55"
                })
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.recieveShadow = true;
                return mesh;
            }

            // store function in variable in order to later pass into tb.Object() method.
            let cube = createCube();

            function createPrism() {
                const geometry = new THREE.BoxGeometry(200, 800, 200);
                const material = new THREE.MeshLambertMaterial({
                    color: "#4d0000"
                })
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.recieveShadow = true;
                return mesh;
            }
            let rectangle = createPrism(200, 800, 200);

            function createLight() {
                const pointLight = new THREE.DirectionalLight("#FFFFFF", 1.8); // color, brightness
                pointLight.castShadow = true;
                pointLight.shadow.mapSize.width = 2048;
                pointLight.shadow.mapSize.height = 2048;
                return pointLight;
            }
            let light = createLight();
            let light2 = createLight();

            // the returned THREE mesh is then passed into the THREEBOX Object3d method.
            // Coordinates and rotation properties are also set.
            cube = tb.Object3D({
                obj: cube,
                units: 'meters',
            })
            .setCoords(coords.siena)
            .set(rotate())
            
            rectangle = tb.Object3D({
                obj: rectangle,
                units: 'meters'
            })
            .setCoords(coords.leTolfe)
            .set(rotate())

            // Options on how to render a sphere
            const sphere = tb.sphere({
                radius: 300,
                units: 'meters',
                sides: 50,
                color: 'blue',
                material: 'MeshLambertMaterial'
            })
            .setCoords(coords.tognazza)

            light = tb.Object3D({
                obj: light
            })
            .setCoords(coords.coloniaSantaRegina)

            light2 = tb.Object3D({
                obj: light2
            })
            .setCoords(coords.marcialla)

            // Added to the map
            tb.add(cube);
            tb.add(rectangle);
            tb.add(sphere);
            tb.add(light);
            tb.add(light2);
        },
        
        render: function(gl, matrix){
            tb.update();
        }
    });
});