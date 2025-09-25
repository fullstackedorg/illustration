import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { loadDataFromLocalOrRemote } from "./utils";
import { CONFIG } from "../src/config";
const loader = new RGBELoader();

export async function loadHDR(filename: string) {
    const data = await loadDataFromLocalOrRemote(filename);
    const url = URL.createObjectURL(new Blob([data]));
    const hdr = await loader.loadAsync(url);

    const pmremGenerator = new THREE.PMREMGenerator(CONFIG.renderer);
    pmremGenerator.compileEquirectangularShader();

    hdr.mapping = THREE.EquirectangularReflectionMapping;

    const envMap = pmremGenerator.fromEquirectangular(hdr).texture;

    // CONFIG.scene.background = hdr;
    CONFIG.scene.environment = envMap;
    CONFIG.scene.environmentRotation.y = 45;
    CONFIG.scene.environmentIntensity = 0.8;
    CONFIG.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    pmremGenerator.dispose();
}
