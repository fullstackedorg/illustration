import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import JSZip from "jszip";
import {
    initShadowOnModel,
    loadDataFromLocalOrRemote,
    resizeAndCenterModel,
} from "./utils";
import { CONFIG } from "../src/config";

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);
const jsZip = new JSZip();

export async function loadGLTF(filename: string) {
    const data = await loadDataFromLocalOrRemote(filename);

    let url: string;
    if (filename.endsWith(".zip")) {
        const zip = await jsZip.loadAsync(data);
        const bin = await zip.file("scene.bin").async("blob");
        manager.setURLModifier((url) => {
            if (url.endsWith("scene.bin")) return URL.createObjectURL(bin);
            return url;
        });
        url = URL.createObjectURL(await zip.file("scene.gltf").async("blob"));
    } else {
        url = URL.createObjectURL(new Blob([data]));
    }

    return new Promise<void>((res) => {
        loader.load(url, function (gltf) {
            const model = gltf.scene;
            CONFIG.scene.add(model);
            initShadowOnModel(model);
            resizeAndCenterModel(model);
            CONFIG.models.push({
                id: filename,
                model,
            });
            res();
        });
    });
}
