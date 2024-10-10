import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'

export default class Scene4 {
    constructor() {
        this.group = new THREE.Group()
        this.mouse = new THREE.Vector2()
        this.lastUpdateTime = 0
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
        this.createPetals()
        this.createTypewriterText()
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

    // === Add typewriter text ===
    createTypewriterText() {
        const canvas = document.createElement('canvas')
        canvas.width = 500
        canvas.height = 220
        this.ctx = canvas.getContext('2d')

        this.textTexture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ map: this.textTexture })
        this.textSprite = new THREE.Sprite(material)

        this.textSprite.scale.set(5, 2.5, 0.5)
        this.textSprite.position.set(-6.7, 0.2, 6)

    // this.textSprite.scale.set(10, 5, 1) // You might want to adjust this
   // this.textSprite.position.set(-8, 2, 6) // Moved more to the left and slightly up

        this.group.add(this.textSprite)

        this.fullText = "The Daruma doll is a special symbol of good luck, happiness, and never giving up! Some people say it can even protect you from bad things and bring in lots of good things."
        this.currentText = ""
        this.textIndex = 0
        this.updateInterval = 50 // milliseconds between each character
        this.isTextComplete = false
        this.fadeStartTime = 0
    }

    updateTypewriterText() {
        const currentTime = performance.now()
        if (currentTime - this.lastUpdateTime > this.updateInterval && this.textIndex < this.fullText.length) {
            this.currentText += this.fullText[this.textIndex]
            this.textIndex++
            this.lastUpdateTime = currentTime

    //=== text font ===
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.ctx.font = '20px Arial'
            this.ctx.fillStyle = 'white'
            this.wrapText(this.ctx, this.currentText, 20, 50, this.ctx.canvas.width - 40, 40)

            this.textTexture.needsUpdate = true

        }
    }

    wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ')
        let line = ''

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = context.measureText(testLine)
            const testWidth = metrics.width
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y)
                line = words[n] + ' '
                y += lineHeight
            } else {
                line = testLine
            }
        }
        context.fillText(line, x, y)
    }

    load3DModels() {
        const loader = new GLTFLoader()

        // Load Daruma model
        loader.load('src/3D /DarumaEyes.glb', (gltf) => {
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
        this.updateTypewriterText()
    }
}