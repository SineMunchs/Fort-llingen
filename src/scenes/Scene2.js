import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group()
        this.createGeometry()
        this.createLight()
        this.load3DModel()
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        })
    }

    load3DModel() {
        const loader = new GLTFLoader();
        loader.load('src/3D /DarumaOneEye.glb', (gltf) => {
            console.log('Model loaded:', gltf); // Debugging log
            this._3dmodel = gltf.scene;
            this._3dmodel.scale.set(0.1, 0.1, 0.1); // Use a neutral scale to start
            this._3dmodel.position.set(2, 1.1, 0); // Set to origin initially
            this._3dmodel.rotation.set(0, 0.09, 0); // Set to origin initially
            this.group.add(this._3dmodel);
        }, undefined, (error) => {
            console.error('Error loading GLTF model:', error); // Handle errors
        });

        loader.load('src/3D /cherry1.glb', (gltf) => {
            console.log('CherryBlossoms Model loaded:', gltf); // Debugging log
            this._cherryBlossomsModel = gltf.scene;
            this._cherryBlossomsModel.scale.set(0.1, 0.1, 0.1); // Scale as needed
            this._cherryBlossomsModel.position.set(0, -1, 3); // Set position
            this._cherryBlossomsModel.rotation.set(0, Math.PI / 4, 0); // Set rotation
            this.group.add(this._cherryBlossomsModel); // Add to the scene group
        }, undefined, (error) => {
            console.error('Error loading CherryBlossoms GLTF model:', error); // Handle errors
        });
    }

    createGeometry() {
        const geometry = new THREE.SphereGeometry()
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: true })
        this.sphere = new THREE.Mesh(geometry, material)
        this.group.add(this.sphere)
    }

    updateUserData(userData) {
        this.group.userData = userData
    }

    createLight() {
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5)
        this.group.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2)
        spotLight.position.set(0, 1, 1)
        spotLight.target = this.sphere
        this.group.add(spotLight)

        this.spotLightHelper = new SpotLightHelper(spotLight)
        // Uncomment the next line if you want to add the spotlight helper to the scene
        // this.group.add(this.spotLightHelper)
    }

    adjustModel() {
        if (this._3dmodel) {
            // You can adjust the model's properties here if needed
            // For example:
            // this._3dmodel.rotation.y += 0.01
        }
    }

    update() {
        this.sphere.rotation.x += 0.01
        this.sphere.rotation.y += 0.01
        this.adjustModel()
    }
}