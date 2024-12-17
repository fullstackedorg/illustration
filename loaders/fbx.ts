import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { CONFIG } from "..";
import { initShadowOnModel, resizeAndCenterModel } from "./utils";

const loader = new FBXLoader();

export async function loadFBX(filename: string) {
    loader.load(
        filename,
        function (fbx) {
            console.log(fbx)
            CONFIG.scene.add(fbx);
            resizeAndCenterModel(fbx);
            initShadowOnModel(fbx);
            CONFIG.models.push(fbx);            
        },
    )
}
