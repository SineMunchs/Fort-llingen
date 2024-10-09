import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group()
        this.mouse = new THREE.Vector2()
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
        this.createStars()
        this.addPNGImage()
        this.updateUserData()
        this.setupEventListeners()
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5)
        this.group.add(ambientLight)

        this.spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2)
        this.spotLight.position.set(0, 5, 5)
        this.group.add(this.spotLight)

        // Uncomment the next line if you want to add the spotlight helper to the scene
        // this.spotLightHelper = new SpotLightHelper(this.spotLight)
        // this.group.add(this.spotLightHelper)
    }

    load3DModels() {
        const loader = new GLTFLoader()

        // Load the first model (oneeye.glb)
        loader.load('src/3D /oneeye.glb', (gltf) => {
            this._3dmodel = gltf.scene
            this._3dmodel.scale.set(0.1, 0.1, 0.1)
            this._3dmodel.position.set(2, -2, 0)
            this._3dmodel.rotation.set(0, -0.5, 0)
            this.group.add(this._3dmodel)
        }, undefined, (error) => {
            console.error('Error loading oneeye.glb:', error)
        })

        // Load the second model (bridge.glb)
        loader.load('src/3D /bridge.glb', (gltf) => {
            this._cherryBlossomsModel = gltf.scene
            this._cherryBlossomsModel.scale.set(10, 10, 1)
            this._cherryBlossomsModel.position.set(-10, -1, -3)
            this._cherryBlossomsModel.rotation.set(0, Math.PI / -10, 0)
            this.group.add(this._cherryBlossomsModel)
            this.createTreeSpotlight()
        }, undefined, (error) => {
            console.error('Error loading bridge.glb:', error)
        })
    }
    addPNGImage() {
        const loader = new THREE.TextureLoader()
        loader.load('public/texture/start.png', (texture) => {
            const material = new THREE.SpriteMaterial({ map: texture })
            this.sprite = new THREE.Sprite(material)
            
            // Set the size of the sprite
            this.sprite.scale.set(5, 5, 5) // Adjust these values as needed
            
            // Position the sprite in the middle of the scene
            this.sprite.position.set(0, 8, 0)
            
            this.group.add(this.sprite)
        })
    

        loader.load('public/texture/nr1.png', (texture) => {
            const material = new THREE.SpriteMaterial({ map: texture })
            this.sprite = new THREE.Sprite(material)
            
            // Set the size of the sprite
            this.sprite.scale.set(4, 2, 2) // Adjust these values as needed
            
            // Position the sprite in the middle of the scene
            this.sprite.position.set(-5, 0, 6)
            
            this.group.add(this.sprite)
        })

            
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

    createStars() {
        const radius = 500
        const starCount = 1000
        const starGeometry = new THREE.BufferGeometry()
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            sizeAttenuation: false
        })

        const positions = new Float32Array(starCount * 3)

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3
            const theta = 2 * Math.PI * Math.random()
            const phi = Math.acos(2 * Math.random() - 1)
            const randomRadius = radius + (Math.random() - 0.5) * 50

            positions[i3] = randomRadius * Math.sin(phi) * Math.cos(theta)
            positions[i3 + 1] = randomRadius * Math.sin(phi) * Math.sin(theta)
            positions[i3 + 2] = randomRadius * Math.cos(phi)
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.stars = new THREE.Points(starGeometry, starMaterial)
        this.group.add(this.stars)
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

    degToRad(degrees) {
        return degrees * (Math.PI / 180)
    }

    adjustModel() {
        if (this._3dmodel) {
            this._3dmodel.rotation.y = this.mouse.x * Math.PI / 2
        }
    }

    update() {
        this.adjustModel()
        if (this.stars) {
            this.stars.rotation.y += 0.0001
        }
        if (this.spotLightHelper) {
            this.spotLightHelper.update()
        }
    }
}