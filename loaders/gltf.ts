import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
    initShadowOnModel,
    loadDataFromLocalOrRemote,
    resizeAndCenterModel,
} from "./utils";
import { CONFIG } from "../src/config";
import archive from "archive";

const manager = new THREE.LoadingManager();
const loader = new GLTFLoader(manager);

export async function loadGLTF(filename: string) {
    const data = await loadDataFromLocalOrRemote(filename);

    let url: string;
    if (filename.endsWith(".zip")) {
        const zip = await archive.unzip(data);

        const binData = zip["scene.bin"].contents;
        const bin = new Blob([binData], { type: "application/octet-stream" });
        manager.setURLModifier((url) => {
            if (url.endsWith("scene.bin")) return URL.createObjectURL(bin);
            return url;
        });

        const gltfData = zip["scene.gltf"].contents;
        const gltf = new Blob([gltfData], { type: "application/octet-stream" });
        url = URL.createObjectURL(gltf);
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
