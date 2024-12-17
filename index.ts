import * as THREE from "three";
import { loadGLTF } from "./loaders/gltf";
import Stats from "three/examples/jsm/libs/stats.module.js";
import setup from "./src/setup";
import controls from "./src/controls";
import { loadFBX } from "./loaders/fbx";
import snapshot from "./src/snapshot";

export const CONFIG = {
    height: window.innerHeight,
    width: window.innerWidth,
    backgroundColor: "#FFFFFF",

    renderer: null as THREE.Renderer,
    scene: null as THREE.Scene,
    camera: null as THREE.Camera,
    models: [] as THREE.Object3D[]
};

const camera = new THREE.PerspectiveCamera(
    70,
    CONFIG.width / CONFIG.height,
    0.01,
    10,
);
camera.position.z = 1;
camera.position.y = 1;

const scene = new THREE.Scene();
scene.background = new THREE.Color(CONFIG.backgroundColor);

const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    preserveDrawingBuffer: true,
    alpha: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setSize(CONFIG.width, CONFIG.height);
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement);

CONFIG.camera = camera;
CONFIG.scene = scene;
CONFIG.renderer = renderer;

const stats = new Stats();
document.body.appendChild(stats.dom);

setup();
controls();
snapshot();

// loadFBX("https://files.fullstacked.org/models/Rocket.fbx");
loadGLTF("https://files.fullstacked.org/models/go_gopher.zip");

function animate(){
    stats.update();
    renderer.render(scene, camera);
}
