import * as THREE from "three";
import { CONFIG } from "..";

export default () => {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
    CONFIG.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(4, 5, 4);
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;
    CONFIG.scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    // directionalLight.shadow.camera.near = 0.1;
    // directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.radius = 5;
    // directionalLight.shadow.bias = 0.5;

    const material = new THREE.ShadowMaterial({ opacity: 0.2 });
    const geometry = new THREE.PlaneGeometry(100, 100);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.y = 0;
    CONFIG.scene.add(mesh);
};
