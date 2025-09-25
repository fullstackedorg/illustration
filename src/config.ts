import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const CONFIG = {
    height: window.innerHeight,
    width: window.innerWidth,
    backgroundColor: "#FFFFFF",

    modelsURL: "https://files.fullstacked.org/models",

    renderer: null as THREE.WebGLRenderer,
    scene: null as THREE.Scene,
    camera: null as THREE.Camera,
    orbitControls: null as OrbitControls,
    models: [] as {
        id: string;
        model: THREE.Object3D;
    }[],
};