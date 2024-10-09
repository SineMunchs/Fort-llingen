import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'  // Make sure this path is correct

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group();
        this.createLight();
        this.load3DModel();
        this.createPetals();
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        });

        // Add mouse move event listener
        this.mouse = new THREE.Vector2();  // Store normalized mouse coordinates
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    // Mouse move handler
    onMouseMove(event) {
        // Normalize mouse position from (-1, 1)
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    load3DModel() {
        const loader = new GLTFLoader();
        loader.load('src/3D /DarumaOneEye.glb', (gltf) => {
            console.log('Model loaded:', gltf);
            this._3dmodel = gltf.scene;
            this._3dmodel.scale.set(0.1, 0.1, 0.1);
            this._3dmodel.position.set(-4, 1, 0);
            this._3dmodel.rotation.set(0, -0.2, 0);
            this.group.add(this._3dmodel);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error);
        });

        loader.load('src/3D /cherry1.glb', (gltf) => {
            console.log('CherryBlossoms Model loaded:', gltf);
            this._cherryBlossomsModel = gltf.scene;
            this._cherryBlossomsModel.scale.set(0.11, 0.11, 0.11);
            this._cherryBlossomsModel.position.set(-2, -1.6, 6);
            this._cherryBlossomsModel.rotation.set(0, Math.PI / -9, 0);
            this.group.add(this._cherryBlossomsModel);
            this.createTreeSpotlight();
        }, undefined, (error) => {
            console.error('Error loading CherryBlossoms GLTF model:', error);
        });
    }

    updateUserData(userData) {
        this.group.userData = userData;
    }

    createPetals() {
        this.petals = new Petals(this.group);  // Pass this.group instead of scene
    }

    createSkybox (){
        this.Skybox = new Skybox(this.group);
    }

    createLight() {
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5);
        this.group.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2);
        spotLight.position.set(0, 5, 5);
        this.group.add(spotLight);

        this.spotLightHelper = new SpotLightHelper(spotLight);
    }

    createTreeSpotlight() {
        if (this._cherryBlossomsModel) {
            const treeSpotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 6, 0.5, 2);
            treeSpotLight.position.set(0, 5, 5);
            treeSpotLight.target = this._cherryBlossomsModel;
            this.group.add(treeSpotLight);
        }
    }

    adjustModel() {
        if (this._3dmodel) {
            // Apply mouse position to model rotation
            this._3dmodel.rotation.y = this.mouse.x * Math.PI;  // Rotate based on mouse X
            this._3dmodel.rotation.x = this.mouse.y * Math.PI / 4;  // Rotate based on mouse Y
        }
    }

    update() {
        this.adjustModel();
        if (this.petals) {
            this.petals.updatePetals();
        }
    }
}
