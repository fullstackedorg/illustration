import * as THREE from "three";
import { CONFIG } from "..";
import core_fetch from "fetch";
import fs from "fs";

export function resizeAndCenterModel(model: THREE.Object3D) {
    var helper = new THREE.BoxHelper(model, 0xff0000);
    helper.update();
    helper.geometry.computeBoundingBox();
    let bbox = helper.geometry.boundingBox;
    const longestEdge = Math.max(
        bbox.max.x - bbox.min.x,
        bbox.max.y - bbox.min.y,
        bbox.max.z - bbox.min.z,
    );
    model.scale.set(
        model.scale.x / longestEdge,
        model.scale.y / longestEdge,
        model.scale.z / longestEdge,
    );
    helper.update();
    helper.geometry.computeBoundingBox();
    bbox = helper.geometry.boundingBox;
    const currentPos = new THREE.Vector3(
        model.position.x,
        model.position.y,
        model.position.x,
    );
    model.position.set(currentPos.x, currentPos.y - bbox.min.y, currentPos.z);
}

export function initShadowOnModel(model: THREE.Object3D) {
    model.traverse((o) => {
        o.castShadow = true;
    });
}

export async function loadDataFromLocalOrRemote(filename: string) {
    const localURL = `data/${filename}`;
    const remoteURL = `${CONFIG.modelsURL}/${filename}`;
    let data: Uint8Array;
    if(!await fs.exists(localURL)) {
        data = (await core_fetch(remoteURL)).body;
        await fs.mkdir("data");
        await fs.writeFile(localURL, data)
    } else {
        data = await fs.readFile(localURL);
    }

    return data;
}
