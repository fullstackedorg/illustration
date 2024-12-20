import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CONFIG } from "..";

const raycaster = new THREE.Raycaster();
let currentModel: THREE.Object3D;

export default () => {

    const control = new TransformControls(
        CONFIG.camera,
        CONFIG.renderer.domElement,
    );
    let editing = false;
    control.addEventListener("dragging-changed", function (event) {
        editing = true;
        CONFIG.orbitControls.enabled = !event.value;
    });
    control.addEventListener("objectChange", () => {
        if (control.getMode() === "scale") {
            const { x, y, z } = currentModel.scale;
            if (x === y) {
                currentModel.scale.set(z, z, z);
            } else if (x === z) {
                currentModel.scale.set(y, y, y);
            } else {
                currentModel.scale.set(x, x, x);
            }
        }
    });
    const gizmo = control.getHelper();
    CONFIG.scene.add(gizmo);

    CONFIG.renderer.domElement.addEventListener("mouseup", (e) => {
        e.preventDefault();

        if (editing) {
            editing = false;
            return;
        }

        const mouse = new THREE.Vector2(
            (e.clientX / CONFIG.renderer.domElement.clientWidth) * 2 - 1,
            -(e.clientY / CONFIG.renderer.domElement.clientHeight) * 2 + 1,
        );

        raycaster.setFromCamera(mouse, CONFIG.camera);

        const intersects = raycaster.intersectObjects(
            CONFIG.models.map(({ model }) => model),
        );

        if (intersects.length > 0) {
            const model = getRootModel(intersects.at(0).object);
            control.attach(model);
            currentModel = model;
        } else {
            control.detach();
            currentModel = null;
        }
    });

    window.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "w":
                control.setMode("translate");
                break;
            case "e":
                control.setMode("rotate");
                break;
            case "r":
                control.setMode("scale");
                break;
            case " ":
                control.enabled = !control.enabled;
                break;
            case "Escape":
                control.reset();
                break;
        }
    });
};

function getRootModel(obj: THREE.Object3D) {
    if (obj.parent.parent === null) {
        return obj;
    }

    return getRootModel(obj.parent);
}
