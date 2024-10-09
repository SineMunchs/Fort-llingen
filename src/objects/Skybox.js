import * as THREE from 'three';

export default class Skybox {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
    }

    createSkybox() {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('public/texture/clouds4.png');
        const geometry = new THREE.SphereGeometry(100, 60, 40);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    update() {
        // You can add any update logic here if needed
        // For example, if you want to rotate the skybox:
        // if (this.mesh) this.mesh.rotation.y += 0.001;
    }
}