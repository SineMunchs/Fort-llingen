import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group()
        this.createLight()
        this.load3DModel()
        this.createFog()  // Add the fog here
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        })
    }



    createFog() {
        // Add fog to the scene (linear fog)
        this.group.fog = new THREE.Fog(0xf0f5f5, 10, 50);  // You can adjust color and range as needed
    }

    load3DModel() {
        const loader = new GLTFLoader();
        loader.load('src/3D /oneeye.glb', (gltf) => {
            console.log('Model loaded:', gltf); // Debugging log
            this._3dmodel = gltf.scene;
            this._3dmodel.scale.set(0.1, 0.1, 0.1); // Use a neutral scale to start
            this._3dmodel.position.set(2, -2, 0); // Set to origin initially
            this._3dmodel.rotation.set(0, -0.5, 0); // Set to origin initially
            this.group.add(this._3dmodel);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error); // Handle errors
        });

        loader.load('src/3D /open.glb', (gltf) => {
            console.log('CherryBlossoms Model loaded:', gltf); // Debugging log
            this._cherryBlossomsModel = gltf.scene;
            this._cherryBlossomsModel.scale.set(1, 1, 1); // Scale as needed
            this._cherryBlossomsModel.position.set(-5, -1, -3 ); // Set position
            this._cherryBlossomsModel.rotation.set(0, Math.PI / -10, 0); // Set rotation
            this.group.add(this._cherryBlossomsModel); // Add to the scene group
            this.createTreeSpotlight(); // Create spotlight after the tree is loaded
        }, undefined, (error) => {
            console.error('Error loading CherryBlossoms GLTF model:', error); // Handle errors
        });
    }

    updateUserData(userData) {
        this.group.userData = userData
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
            treeSpotLight.position.set(0, 5, 5) // Position the light above and in front of the tree
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
        }
    }

    update() {
        this.adjustModel()
    }
}
