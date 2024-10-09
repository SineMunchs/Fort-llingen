import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'

export default class Scene3 {
    constructor() {
        this.group = new THREE.Group()
        this.mouse = new THREE.Vector2()
        this.flowerPosition = 0
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
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

        // Load Cherry Blossoms models
        this.loadCherryBlossoms(loader, 3, 4, -1.6, -6)
        this.loadCherryBlossoms(loader, 4, 8, -5, -6)

        // Load Flower model with animation
        loader.load('src/3D /flower.glb', (gltf) => {
            this._flowerModel = gltf.scene
            this._flowerModel.scale.set(20, 20, 20)
            this._flowerModel.position.set(0, 0, 0)
            this._flowerModel.rotation.set(0, Math.PI / -9, 0)
            this.group.add(this._flowerModel)
            this.createTreeSpotlight()
            
            // Start the flower animation
            this.animateFlower()
        }, undefined, (error) => {
            console.error('Error loading flower model:', error)
        })
    }

    loadCherryBlossoms(loader, scale, x, y, z) {
        loader.load('src/3D /grey.glb', (gltf) => {
            const cherryBlossomsModel = gltf.scene
            cherryBlossomsModel.scale.set(scale, scale, scale)
            cherryBlossomsModel.position.set(x, y, z)
            cherryBlossomsModel.rotation.set(0, Math.PI / -7, 0)
            this.group.add(cherryBlossomsModel)
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

    animateFlower() {
        if (this._flowerModel) {
            this.flowerPosition += 0.01 // Adjust this value to change the speed
            this._flowerModel.position.y = Math.sin(this.flowerPosition) * 0.5 // Adjust 0.5 to change the range of motion
        }
        requestAnimationFrame(() => this.animateFlower())
    }

    createSkybox() {
        const textureLoader = new THREE.TextureLoader()
        const backgroundTexture = textureLoader.load('public/texture/cloudsgrey.jpg')
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
            // Only rotate on the Y-axis based on mouse X position
            this._3dmodel.rotation.y = this.mouse.x * Math.PI / 2
        }
    }

    update() {
        this.adjustModel()
        if (this.petals) {
            this.petals.updatePetals()
        }
        if (this.spotLightHelper) {
            this.spotLightHelper.update()
        }
        // No need to call animateFlower() here as it's using requestAnimationFrame
    }
}