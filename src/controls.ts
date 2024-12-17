import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CONFIG } from "..";

const raycaster = new THREE.Raycaster();

export default () => {
    const orbit = new OrbitControls(CONFIG.camera, CONFIG.renderer.domElement);
    orbit.update();

    const control = new TransformControls(
        CONFIG.camera,
        CONFIG.renderer.domElement,
    );
    let editing = false;
    control.addEventListener("dragging-changed", function (event) {
        editing = true;
        orbit.enabled = !event.value;
    });
    const gizmo = control.getHelper();
    CONFIG.scene.add(gizmo);

    CONFIG.renderer.domElement.addEventListener("mouseup", (e) => {
        e.preventDefault();

        if(editing) {
            editing = false;
            return;
        }

        const mouse = new THREE.Vector2(
            (e.clientX / CONFIG.renderer.domElement.clientWidth) * 2 - 1,
            -(e.clientY / CONFIG.renderer.domElement.clientHeight) * 2 + 1,
        );

        raycaster.setFromCamera(mouse, CONFIG.camera);

        const intersects = raycaster.intersectObjects(CONFIG.models);

        if (intersects.length > 0) {
            const model = getRootModel(intersects.at(0).object);
            control.attach(model);
        } else {
            control.detach();
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
