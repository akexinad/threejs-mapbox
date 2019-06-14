let count = 0;

function createRenderer() {
  // Where will the user see the 3d world
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Set the beackground color
  renderer.setClearColor("#16161d"); // Eigengrau
  // renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio); // For Retina screens
  const output = document.querySelector("#output");
  output.appendChild(renderer.domElement);
  // console.log(renderer);
  return renderer;
}

function createScene() {
  const scene = new THREE.Scene();
  return scene;
}

function createCamera(scene) {
  const camera = new THREE.PerspectiveCamera(
    45, // Field of View
    window.innerWidth / window.innerHeight, // ratio
    0.1, // near value (Macro)
    1000 // far value (Horizon)
  );
  // camera.position.x = -30; // left to right // Left 30
  // camera.position.y = 40; // top to bottom // Up 40
  // camera.position.z = 30; // Front to Back // Back 30
  camera.position.x = -30; // left to right // Left 30
  camera.position.y = 30; // top to bottom // Up 40
  camera.position.z = 40; // Front to Back // Back 40
  camera.lookAt(scene.position);
  return camera;
}

function createAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  return axesHelper;
}

function createFloor() {
  const floorMaterial = new THREE.MeshLambertMaterial({
    color: "#CED3DC",
  });

  const floorGeometry = new THREE.BoxGeometry(60, 0.1, 20); // WIDTH HEIGHT DEPTH
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.x = 15; // changes the floor position relative to the axes
  floor.receiveShadow = true;
  return floor;
}

function createCube({ width, height, depth, x, y, z }) {
  console.log(width, height);
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mat = new THREE.MeshLambertMaterial({
    color: "#A31621",
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.recieveShadow = true;
  return mesh;
}

function createSphere() {
  const geo = new THREE.SphereGeometry(4, 30, 30);
  const mat = new THREE.MeshLambertMaterial({
    color: "#016FB9",
    // wireframe: true
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(20, 4, 0);
  mesh.castShadow = true;
  mesh.recieveShadow = true;
  return mesh;
}

function createLight() {
  const pointLight = new THREE.PointLight("#FFFFFF", 1.3);
  pointLight.position.x = 4;
  pointLight.position.y = 18;
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  return pointLight;
}

function createLightHelper(light) {
  const helper = new THREE.PointLightHelper(light);
  return helper;
}

function addOrbitControls(camera, renderer) {
  // console.log(camera, renderer);
  new THREE.OrbitControls(camera, renderer.domElement);
}

const renderer = createRenderer();
const scene = createScene();
const camera = createCamera(scene);
const axes = createAxesHelper();
const floor = createFloor()
const cube = createCube({
  width: 4,
  height: 4,
  depth: 4,
  x: -4,
  y: 4,
  z: 0,
});

const sphere = createSphere();
const light = createLight();
const lightHelper = createLightHelper(light);

scene.add(axes, floor, cube, sphere, light, lightHelper);

addOrbitControls(camera, renderer)

renderer.render(scene, camera);

function animate() {
  count += 0.1;
  sphere.position.x = Math.cos(count) * 10 + 18;
  sphere.position.y = Math.abs(Math.sin(count)) * 10 + 4;

  cube.position.x = Math.sin(count) * 10;
  cube.position.y = Math.abs(Math.cos(count)) * 10;

  // console.log("animate was called");
  // cube.rotation.x += 0.1;
  // cube.rotation.y += 0.1;
  // cube.rotation.z += 0.1;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// animate();
