// INITIALLY YOU NEED TO BUILD THREE THINGS, THE RENDERER, THE CAMERA AND THE SCENE.

// 1. THE RENDERER
function createRenderer() {
    // This is where the user will see the 3d world.
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Background color
    renderer.setClearColor('#31a931');

    // Set shadows on rendered objects.
    renderer.shadowMap.enabled = true;

    // appending the renderer to the correct dom element.
    const output = document.querySelector("#output");
    output.appendChild(renderer.domElement);
    return renderer;
}

// 2. THE SCENE
function createScene() {
    const scene = new THREE.Scene();
    return scene;
}

// 3. THE CAMERA
function createCamera(scene) {
    const camera = new THREE.PerspectiveCamera(
        45, // Field of View
        window.innerWidth / window.innerHeight, // ratio
        0.1, // near value (Macro)
        1000 // far value (Horizon)
    );

    camera.position.x = -30;
    camera.position.y = 30;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    return camera;
}

// 4. DISPLAY AN AXES
function createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(100);
    return axesHelper;
}

// 5. BUILD A FLOOR
function createFloor() {
    // What do you want the floor to be made of.
    const floorMaterial = new THREE.MeshLambertMaterial({
        color: "#0000ff"
    });

    // The floor shape.
    const floorGeometry = new THREE.BoxGeometry(60, 0.1, 20); // WIDTH, HEIGHT, DEPTH

    // To create the mesh, you need to combine the floor's [shape] geometry with the material material with which it is made.
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    // Now the floor's position in the scene relative to the axes
    floor.position.x = 20;
    floor.recieveShadow = true;
    return floor;
}

function createRectangle({ width, height, depth, x, y, z }) {
    console.log(width, height);

    // again, shape and material
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshLambertMaterial({
        color: "#FFC0CB"
    });

    // and wrap the mesh
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.recieveShadow = true;
    return mesh;
}

function createSphere() {
    const geo = new THREE.SphereGeometry(4, 20, 30);
    const mat = new THREE.MeshLambertMaterial({
        color: "#d40000",
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-4, 4, 0);
    mesh.castShadow = true;
    mesh.recieveShadow = true;
    return mesh;
}

function createLight() {
    const pointLight = new THREE.PointLight("#FFFFFF", 1.2); // color, brightness
    pointLight.position.x = 4;
    pointLight.position.y = 30;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    return pointLight;
}

// The light helper displays a meshed diamond to HELP YOU see the light source
function createLightHelper(light) {
    const helper = new THREE.PointLightHelper(light);
    return helper;
}

function addOrbitControls(camera, renderer) {
    new THREE.OrbitControls(camera, renderer.domElement);
}

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(scene);
const axes = createAxesHelper();
const floor = createFloor();
const rectangle = createRectangle({
    width: 10,
    height: 4,
    depth: 4,
    x: 10,
    y: 4,
    z: 4
});
const sphere = createSphere();

const light = createLight();
const lightHelper = createLightHelper(light);

// Add axes to the scene, so renderer can render it within the scene.
scene.add(axes, floor, rectangle, sphere, light, lightHelper);

addOrbitControls(camera, renderer);


function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// renderer.render(scene, camera);
animate();