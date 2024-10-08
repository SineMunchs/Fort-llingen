import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'  // Make sure this path is correct

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group()
        this.createLight()
        this.load3DModel()
        this.createPetals()
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        })
    }

    load3DModel() {
        const loader = new GLTFLoader();
        loader.load('src/3D /DarumaOneEye.glb', (gltf) => {
            console.log('Model loaded:', gltf);
            this._3dmodel = gltf.scene;
            this._3dmodel.scale.set(0.1, 0.1, 0.1);
            this._3dmodel.position.set(-5, 1, 0);
            this._3dmodel.rotation.set(0, -0.2, 0);
            this.group.add(this._3dmodel);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error);
        });

        loader.load('src/3D /cherry1.glb', (gltf) => {
            console.log('CherryBlossoms Model loaded:', gltf);
            this._cherryBlossomsModel = gltf.scene;
            this._cherryBlossomsModel.scale.set(0.2, 0.1, 0.1);
            this._cherryBlossomsModel.position.set(3, -1, 7);
            this._cherryBlossomsModel.rotation.set(0, Math.PI / 4, 0);
            this.group.add(this._cherryBlossomsModel);
            this.createTreeSpotlight();
        }, undefined, (error) => {
            console.error('Error loading CherryBlossoms GLTF model:', error);
        });
    }

    updateUserData(userData) {
        this.group.userData = userData
    }

    createPetals() {
        this.petals = new Petals(this.group);  // Pass this.group instead of scene
    }

    createLight() {
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5)
        this.group.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2)
        spotLight.position.set(0, 5, 5)
        this.group.add(spotLight)

        this.spotLightHelper = new SpotLightHelper(spotLight)
        // Uncomment the next line if you want to add the spotlight helper to the scene
        // this.group.add(this.spotLightHelper)
    }

    createTreeSpotlight() {
        if (this._cherryBlossomsModel) {
            const treeSpotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 6, 0.5, 2)
            treeSpotLight.position.set(0, 5, 5)
            treeSpotLight.target = this._cherryBlossomsModel
            this.group.add(treeSpotLight)

            // Uncomment the next line if you want to add a helper for the tree spotlight
            // const treeSpotLightHelper = new SpotLightHelper(treeSpotLight)
            // this.group.add(treeSpotLightHelper)
        }
    }

    adjustModel() {
        if (this._3dmodel) {
            // You can adjust the model's properties here if needed
            // For example:
            // this._3dmodel.rotation.y += 0.01
        }
    }

    update() {
        this.adjustModel()
        if (this.petals) {
            this.petals.updatePetals()
        }
    }
}