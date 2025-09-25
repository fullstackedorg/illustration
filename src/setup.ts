import * as THREE from "three";
import { CONFIG } from "./config";

export default () => {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 3);
    //CONFIG.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(4, 5, 4);
    directionalLight.castShadow = true;
    directionalLight.intensity = 1.5;
    CONFIG.scene.add(directionalLight);

    // const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    // CONFIG.scene.add( helper );

    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;

    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.radius = 5;
    // directionalLight.shadow.bias = 0.5;

    const material = new THREE.ShadowMaterial({ opacity: 0.2 });
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.receiveShadow = true;
    mesh.position.y = 0;
    CONFIG.scene.add(mesh);
};
