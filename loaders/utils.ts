import * as THREE from "three";
import core_fetch from "fetch";
import fs from "fs";
import { CONFIG } from "../src/config";

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

const createMaterial = (color: THREE.Color) =>
    new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: color.getHex() === 0xFFFFFF ? 0.4 : 0.1,
        metalness: 0.5,
        roughness: 0.2,
        //envMap: CONFIG.scene.environment,
        //envMapIntensity: 1,
    });

export function initShadowOnModel(model: THREE.Object3D) {
    model.traverse((o) => {
        o.castShadow = true;
        if (o instanceof THREE.Mesh) {
            if (Array.isArray(o.material)) {
                o.material = o.material.map((m) => createMaterial(m.color));
            } else {
                o.material = createMaterial(o.material.color);
            }
        }
    });
}

export async function loadDataFromLocalOrRemote(filename: string) {
    const localURL = `data/${filename}`;
    const remoteURL = `${CONFIG.modelsURL}/${filename}`;
    let data: Uint8Array;
    if (!(await fs.exists(localURL))) {
        data = (await core_fetch(remoteURL)).body;
        await fs.mkdir("data");
        await fs.writeFile(localURL, data);
    } else {
        data = await fs.readFile(localURL);
    }

    return data;
}
