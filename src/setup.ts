import * as THREE from "three";
import { CONFIG } from "..";

export default () => {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    CONFIG.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 4);
    directionalLight.castShadow = true;
    directionalLight.intensity = 1;
    CONFIG.scene.add(directionalLight);

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.radius = 10;
    directionalLight.shadow.bias = -0.0001;

    const material = new THREE.ShadowMaterial({ opacity: 1 });
    const geometry = new THREE.PlaneGeometry(100, 100);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    mesh.position.y = 0;
    CONFIG.scene.add(mesh);
};
