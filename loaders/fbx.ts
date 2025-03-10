import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import {
    initShadowOnModel,
    loadDataFromLocalOrRemote,
    resizeAndCenterModel,
} from "./utils";
import { CONFIG } from "../src/config";

const loader = new FBXLoader();

export async function loadFBX(filename: string) {
    const data = await loadDataFromLocalOrRemote(filename);
    const url = URL.createObjectURL(new Blob([data]));
    return new Promise<void>((res) => {
        loader.load(url, function (fbx) {
            CONFIG.scene.add(fbx);
            resizeAndCenterModel(fbx);
            initShadowOnModel(fbx);
            CONFIG.models.push({
                id: filename,
                model: fbx,
            });
            res();
        });
    });
}
