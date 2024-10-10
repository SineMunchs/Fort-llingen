import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Petals from '../objects/Petals.js'

export default class Scene4 {
    constructor() {
        // Create a group to hold all objects in the scene
        this.group = new THREE.Group()
        
        // Store mouse position for interactivity
        this.mouse = new THREE.Vector2()
        
        // Properties for flower animation
        this.flowerPosition = 0
        this.lastUpdateTime = 0
        
        // Text to be displayed in the scene
        this.texts = [
            "One quiet day, Daruma noticed a little flower drooping from thirst. Its petals hung limply, too weak to stand tall. Daruma smiled and rolled over to the flower.",
            "With a gentle nudge, Daruma helped the flower sit up straight again. The flower perked up, happy and full of color."
        ]
        this.currentTextIndex = 0
        
        // Properties for rolling animation
        this.isRolling = false
        this.rollStartPosition = new THREE.Vector3()
        this.rollEndPosition = new THREE.Vector3()
        this.rollProgress = 0
        this.rollDuration = 3000 // 3 seconds for rolling animation
        this.rollDelay = 6000 // 6 seconds delay before rolling starts
        this.rollStartTime = 0
        
        // Initialize the scene
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
        this.createStars()
        this.createTypewriterText()
        this.updateUserData()
        this.setupEventListeners()
    }

    createLights() {
        // Add ambient light to the scene
        const ambientLight = new THREE.AmbientLight(0x999999, 0.5)
        this.group.add(ambientLight)

        // Add spotlight for directed lighting
        this.spotLight = new THREE.SpotLight(0xffffff, 8, 20, Math.PI / 4, 0.1, 2)
        this.spotLight.position.set(0, 5, 5)
        this.group.add(this.spotLight)

        // Create spotlight helper (uncomment to visualize spotlight)
        this.spotLightHelper = new SpotLightHelper(this.spotLight)
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
            this.checkModelsLoaded()
        }, undefined, (error) => {
            console.error('Error loading Daruma model:', error)
        })

        // Load Cherry Blossoms models
        this.loadCherryBlossoms(loader, 3, 4, -1.6, -6)
        this.loadCherryBlossoms(loader, 4, 8, -5, -6)

        // Load Flower model
        loader.load('src/3D /flower.glb', (gltf) => {
            this._flowerModel = gltf.scene
            this._flowerModel.scale.set(20, 20, 20)
            this._flowerModel.position.set(0, 0, 0)
            this._flowerModel.rotation.set(0, Math.PI / -9, 0)
            this.group.add(this._flowerModel)
            this.createTreeSpotlight()
            this.animateFlower()
            this.checkModelsLoaded()
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
        // Add spotlight to illuminate the flower
        if (this._flowerModel) {
            const treeSpotLight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 6, 0.5, 2)
            treeSpotLight.position.set(0, 5, 5)
            treeSpotLight.target = this._flowerModel
            this.group.add(treeSpotLight)
        }
    }

    animateFlower() {
        // Animate the flower with a gentle bobbing motion
        if (this._flowerModel) {
            this.flowerPosition += 0.01
            this._flowerModel.position.y = Math.sin(this.flowerPosition) * 0.5
        }
        requestAnimationFrame(() => this.animateFlower())
    }

    createStars() {
        // Create a starfield in the background
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

    createTypewriterText() {
        // Create a canvas for rendering text
        const canvas = document.createElement('canvas')
        canvas.width = 500
        canvas.height = 220
        this.ctx = canvas.getContext('2d')

        // Create a texture from the canvas
        this.textTexture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ map: this.textTexture })
        this.textSprite = new THREE.Sprite(material)

        // Position and scale the text sprite
        this.textSprite.scale.set(5, 2.5, 0.5)
        this.textSprite.position.set(-6.7, 0.2, 6)

        this.group.add(this.textSprite)

        // Initialize text properties
        this.fullText = this.texts[this.currentTextIndex]
        this.currentText = ""
        this.textIndex = 0
        this.updateInterval = 50 // milliseconds between each character
        this.isTextComplete = false
        this.fadeStartTime = 0
        this.isFading = false
    }

    updateTypewriterText() {
        const currentTime = performance.now()
        
        if (this.isFading) {
            // Handle text fading
            const fadeProgress = (currentTime - this.fadeStartTime) / 1000 // 1 second fade
            if (fadeProgress >= 1) {
                // Fading complete, reset text
                this.isFading = false
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length
                this.fullText = this.texts[this.currentTextIndex]
                this.currentText = ""
                this.textIndex = 0
                this.isTextComplete = false
            } else {
                this.drawFadingText(1 - fadeProgress)
            }
        } else if (currentTime - this.lastUpdateTime > this.updateInterval && this.textIndex < this.fullText.length) {
            // Add next character
            this.currentText += this.fullText[this.textIndex]
            this.textIndex++
            this.lastUpdateTime = currentTime
            this.drawText()
        } else if (this.textIndex === this.fullText.length && !this.isTextComplete) {
            // Text complete, prepare for fading
            this.isTextComplete = true
            this.fadeStartTime = currentTime + 3000 // Start fading after 3 seconds
        } else if (this.isTextComplete && currentTime > this.fadeStartTime) {
            // Start fading
            this.isFading = true
        }
    }

    drawText() {
        // Draw current text on the canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = 'white'
        this.wrapText(this.ctx, this.currentText, 20, 50, this.ctx.canvas.width - 40, 40)
        this.textTexture.needsUpdate = true
    }

    drawFadingText(opacity) {
        // Draw fading text on the canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        this.wrapText(this.ctx, this.currentText, 20, 50, this.ctx.canvas.width - 40, 40)
        this.textTexture.needsUpdate = true
    }

    wrapText(context, text, x, y, maxWidth, lineHeight) {
        // Wrap text to fit within maxWidth
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

    updateUserData() {
        // Set user data for mounting/unmounting animations
        this.group.userData = {
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        }
    }

    setupEventListeners() {
        // Add mouse move event listener
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
    }

    onMouseMove(event) {
        // Update mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    adjustModel() {
        // Rotate Daruma based on mouse position if not rolling
        if (this._3dmodel && !this.isRolling) {
            this._3dmodel.rotation.y = this.mouse.x * Math.PI / 2
        }
    }

    checkModelsLoaded() {
        // Check if both Daruma and flower models are loaded
        if (this._3dmodel && this._flowerModel && !this.isRolling && this.rollStartTime === 0) {
            this.setupRollAnimation()
        }
    }

    setupRollAnimation() {
        // Set up the rolling animation
        this.rollStartPosition.copy(this._3dmodel.position)
        this.rollEndPosition.copy(this._flowerModel.position)
        this.rollEndPosition.y = this._3dmodel.position.y // Keep the same Y position
        
        // Set the time when rolling should start (current time + delay)
        this.rollStartTime = performance.now() + this.rollDelay
    }

    startRolling() {
        // Start the rolling animation
        this.isRolling = true
        this.rollProgress = 0
    }

    updateRolling() {
        const currentTime = performance.now()

        // Check if it's time to start rolling
        if (this.rollStartTime > 0 && currentTime >= this.rollStartTime && !this.isRolling) {
            this.startRolling()
        }

        if (!this.isRolling) return

        // Calculate roll progress
        this.rollProgress = Math.min((currentTime - this.rollStartTime) / this.rollDuration, 1)

        if (this.rollProgress < 1) {
            // Update Daruma's position
            this._3dmodel.position.lerpVectors(this.rollStartPosition, this.rollEndPosition, this.rollProgress)

            // Update Daruma's rotation
            const rollAngle = this.rollProgress * Math.PI * 2 // Two full rotations
            this._3dmodel.rotation.z = rollAngle

            // Add a slight bobbing effect
            const bobHeight = Math.sin(this.rollProgress * Math.PI) * 0.2
            this._3dmodel.position.y = this.rollStartPosition.y + bobHeight
        } else {
            // Finish rolling
            this.isRolling = false
            this._3dmodel.position.copy(this.rollEndPosition)
            this._3dmodel.rotation.z = 0
        }
    }

    update() {
        // Main update function called every frame
        this.adjustModel()
        if (this.petals) {
            this.petals.updatePetals()
        }
        if (this.spotLightHelper) {
            this.spotLightHelper.update()
        }
        this.updateTypewriterText()
        this.updateRolling()
    }
}