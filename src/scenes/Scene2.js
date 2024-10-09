import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'

export default class Scene2 {
    constructor() {
        this.group = new THREE.Group()
        this.mouse = new THREE.Vector2()
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
        this.createPetals()
        this.createSkybox()
        this.updateUserData()
        this.setupEventListeners()
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5)
        this.group.add(ambientLight)

        this.spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2)
        this.spotLight.position.set(0, 5, 5)
        this.group.add(this.spotLight)

        this.spotLightHelper = new SpotLightHelper(this.spotLight)
        // Uncomment the next line if you want to add the spotlight helper to the scene
        // this.group.add(this.spotLightHelper)
    }

    load3DModels() {
        const loader = new GLTFLoader()

        // Load Daruma model
        loader.load('src/3D /DarumaOneEye.glb', (gltf) => {
            this._3dmodel = gltf.scene
            this._3dmodel.scale.set(0.1, 0.1, 0.1)
            this._3dmodel.position.set(-4, 1, 0)
            this._3dmodel.rotation.set(0, -0.2, 0)
            this.group.add(this._3dmodel)
        }, undefined, (error) => {
            console.error('Error loading Daruma model:', error)
        })

        // Load Cherry Blossoms model
        loader.load('src/3D /tree3.glb', (gltf) => {
            this._cherryBlossomsModel = gltf.scene
            this._cherryBlossomsModel.scale.set(3, 3, 3)
            //this._cherryBlossomsModel.scale.set(0.11, 0.11, 0.11)
            this._cherryBlossomsModel.position.set(4, -1.6, -6)
            this._cherryBlossomsModel.rotation.set(0, Math.PI / -9, 0)
            this.group.add(this._cherryBlossomsModel)
            this.createTreeSpotlight()
        }, undefined, (error) => {
            console.error('Error loading Cherry Blossoms model:', error)
        })
        loader.load('src/3D /tree3.glb', (gltf) => {
            this._cherryBlossomsModel = gltf.scene
            this._cherryBlossomsModel.scale.set(4, 4, 4)
            //this._cherryBlossomsModel.scale.set(0.11, 0.11, 0.11)
            this._cherryBlossomsModel.position.set(8, -5, -6)
            this._cherryBlossomsModel.rotation.set(0, Math.PI / -9, 0)
            this.group.add(this._cherryBlossomsModel)
            this.createTreeSpotlight()
        }, undefined, (error) => {
            console.error('Error loading Cherry Blossoms model:', error)
        })
    }

    createTreeSpotlight() {
        if (this._cherryBlossomsModel) {
            const treeSpotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 6, 0.5, 2)
            treeSpotLight.position.set(0, 5, 5)
            treeSpotLight.target = this._cherryBlossomsModel
            this.group.add(treeSpotLight)
        }
    }

    createPetals() {
        this.petals = new Petals(this.group)
    }

    createSkybox() {
        const textureLoader = new THREE.TextureLoader()
        const backgroundTexture = textureLoader.load('public/texture/clouds4.png')
        const backgroundGeometry = new THREE.SphereGeometry(100, 60, 40)
        backgroundGeometry.scale(-1, 1, 1)
        const backgroundMaterial = new THREE.MeshBasicMaterial({ map: backgroundTexture })
        this.skybox = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
        this.group.add(this.skybox)
    }

    updateUserData() {
        this.group.userData = {
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        }
    }

    setupEventListeners() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    adjustModel() {
        if (this._3dmodel) {
            // Only rotate on the X-axis based on mouse Y position
            this._3dmodel.rotation.y = this.mouse.x * Math.PI / 2
        }
    }

    update() {
        this.adjustModel()
        if (this.petals) {
            this.petals.updatePetals()
        }
        // Update spotlight helper if it exists
        if (this.spotLightHelper) {
            this.spotLightHelper.update()
        }
    }
}