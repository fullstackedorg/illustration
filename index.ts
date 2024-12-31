import * as THREE from "three";
import { loadGLTF } from "./loaders/gltf";
import Stats from "three/examples/jsm/libs/stats.module.js";
import setup from "./src/setup";
import controls from "./src/controls";
import { loadFBX } from "./loaders/fbx";
import snapshot from "./src/snapshot";
import exportScene, { load } from "./src/exportScene";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CONFIG } from "./src/config";

const camera = new THREE.PerspectiveCamera(
    50,
    CONFIG.width / CONFIG.height,
    0.01,
    100,
);
camera.position.z = 1;
camera.position.y = 1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.backgroundColor);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(CONFIG.width, CONFIG.height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

CONFIG.camera = camera;
CONFIG.scene = scene;
CONFIG.renderer = renderer;
CONFIG.orbitControls = orbit;

const stats = new Stats();
document.body.appendChild(stats.dom);

setup();
controls();
snapshot();
exportScene();

Promise.all([
    loadFBX("rocket.fbx"),
    loadFBX("android.fbx"),
    loadFBX("apple.fbx"),
    loadFBX("docker.fbx"),
    loadFBX("git.fbx"),
    loadFBX("javascript.fbx"),
    loadFBX("microsoft.fbx"),
    loadFBX("npm.fbx"),
    loadFBX("typescript.fbx"),
    loadFBX("webassembly.fbx"),
    loadFBX("editor.fbx"),
    loadFBX("project.fbx"),
    loadGLTF("go_gopher.zip"),
]).then(() => load("defaultScene.json"));

function animate() {
    stats.update();
    renderer.render(scene, camera);
}
