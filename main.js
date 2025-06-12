const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 30, 50);
controls.update();

const light = new THREE.PointLight(0xffffff, 2, 300);
scene.add(light);

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const planets = [];
const distances = [8, 12, 16, 20, 26, 32, 38, 44];
const sizes = [0.4, 0.9, 1.0, 0.5, 1.1, 1.0, 0.8, 0.7];
const colors = [0x999999, 0xff9933, 0x3399ff, 0xff3333, 0xffcc00, 0x6699ff, 0x9966cc, 0x33cccc];

distances.forEach((distance, i) => {
  const geometry = new THREE.SphereGeometry(sizes[i], 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: colors[i] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = distance;
  mesh.userData = { angle: 0, distance };
  planets.push(mesh);
  scene.add(mesh);
});

function animate() {
  requestAnimationFrame(animate);
  planets.forEach(planet => {
    planet.userData.angle += 0.01 / planet.userData.distance;
    planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
    planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
