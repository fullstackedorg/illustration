import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CONFIG } from "..";
import JSZip from "jszip";
import { initShadowOnModel, resizeAndCenterModel } from "./utils";

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const jsZip = new JSZip();

export async function loadGLTF(filename: string) {
    if (filename.endsWith(".zip")) {
        const zipData = new Uint8Array(
            await (await fetch(filename)).arrayBuffer(),
        );
        const zip = await jsZip.loadAsync(zipData);
        const bin = await zip.file("scene.bin").async("blob");
        manager.setURLModifier((url) => {
            if (url.endsWith("scene.bin")) return URL.createObjectURL(bin);
            return url;
        });
        filename = URL.createObjectURL(
            await zip.file("scene.gltf").async("blob"),
        );
    }

    loader.load(
        filename,
        function (gltf) {
            const model = gltf.scene;
            CONFIG.scene.add(model);
            initShadowOnModel(model);
            resizeAndCenterModel(model);
            CONFIG.models.push(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        function (error) {
            console.log(error);
            console.log("An error happened");
        },
    );
}
