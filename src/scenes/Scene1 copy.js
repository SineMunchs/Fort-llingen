import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default class Scene1 {
    constructor() {
        this.group = new THREE.Group()
        this.mouse = new THREE.Vector2()
        this.lastUpdateTime = 0
        this.texts = [
            "The Daruma doll is a special symbol of good luck, happiness, and to never give up! Some people say it can even protect you from bad things and bring in lots of good things.",
            "That’s why the Daruma doll was made without any eyes. You see, to give Daruma his eyes, you need to work hard and try your best. --> ",
        ]
        this.currentTextIndex = 0
        this.init()
    }

    init() {
        this.createLights()
        this.load3DModels()
        this.createStars()
       // this.addPNGImage()
        this.createTypewriterText()
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

          // Load the second model 
          loader.load('src/3D /start4.glb', (gltf) => {
            this._cherryBlossomsModel = gltf.scene
            this._cherryBlossomsModel.scale.set(4, 4, 4)
            this._cherryBlossomsModel.position.set(28, 10.5, -5)
            this._cherryBlossomsModel.rotation.set(0.2, Math.PI / -8, 0)
            this._cherryBlossomsModel.rotation.y += -0.7;
            this.group.add(this._cherryBlossomsModel)
            this.createTreeSpotlight()
        }, undefined, (error) => {
            console.error('Error loading bridge.glb:', error)
        })

               // Load the second model 
               loader.load('src/3D /audio.glb', (gltf) => {
                this._cherryBlossomsModel = gltf.scene
                this._cherryBlossomsModel.scale.set(0.2, 0.2, 0.2)
                this._cherryBlossomsModel.position.set(-13, 8.5, -5)
                this._cherryBlossomsModel.rotation.set(0.2, Math.PI / -8, 0)
                this._cherryBlossomsModel.rotation.y += -0.7;
                this.group.add(this._cherryBlossomsModel)
                this.createTreeSpotlight()
            }, undefined, (error) => {
                console.error('Error loading bridge.glb:', error)
            })

        
    }
/*    addPNGImage() {
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
    }*/

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

    // === STars maker ===
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

        // === sæt stjerner random ===

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
        // Create a canvas element for rendering text
        const canvas = document.createElement('canvas')
        canvas.width = 500
        canvas.height = 220
        this.ctx = canvas.getContext('2d')
        
        // Create a texture from the canvas and apply it to a sprite
        this.textTexture = new THREE.CanvasTexture(canvas)
        const material = new THREE.SpriteMaterial({ map: this.textTexture })
        this.textSprite = new THREE.Sprite(material)
        
        // Set the scale and position of the text sprite
        this.textSprite.scale.set(5, 2.5, 0.5)
        this.textSprite.position.set(-6.7, 0.2, 6)
        
        // Add the text sprite to the group (assuming 'group' is a THREE.Group)
        this.group.add(this.textSprite)
        
        // Initialize variables for the typewriter effect
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
            // Handle text fading out
            const fadeProgress = (currentTime - this.fadeStartTime) / 1000 // 1 second fade
            if (fadeProgress >= 1) {
                // Reset for next text after fade completes
                this.isFading = false
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length
                this.fullText = this.texts[this.currentTextIndex]
                this.currentText = ""
                this.textIndex = 0
                this.isTextComplete = false
            } else {
                // Continue fading
                this.drawFadingText(1 - fadeProgress)
            }
        } else if (currentTime - this.lastUpdateTime > this.updateInterval && this.textIndex < this.fullText.length) {
            // Add next character for typewriter effect
            this.currentText += this.fullText[this.textIndex]
            this.textIndex++
            this.lastUpdateTime = currentTime
            this.drawText()
        } else if (this.textIndex === this.fullText.length && !this.isTextComplete) {
            // Text is complete, prepare for fading
            this.isTextComplete = true
            this.fadeStartTime = currentTime + 3000 // Start fading after 3 seconds
        } else if (this.isTextComplete && currentTime > this.fadeStartTime) {
            // Start fading
            this.isFading = true
        }
    }
    
    drawText() {
        // Clear the canvas and draw a semi-transparent background
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        
        // Set text properties and draw the current text
        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = 'white'
        this.wrapText(this.ctx, this.currentText, 20, 50, this.ctx.canvas.width - 40, 40)
        
        // Update the texture to reflect changes
        this.textTexture.needsUpdate = true
    }
    
    drawFadingText(opacity) {
        // Similar to drawText, but with adjustable opacity for fading effect
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.font = '20px Arial'
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        this.wrapText(this.ctx, this.currentText, 20, 50, this.ctx.canvas.width - 40, 40)
        this.textTexture.needsUpdate = true
    }
    
    wrapText(context, text, x, y, maxWidth, lineHeight) {
        // Split the text into words
        const words = text.split(' ')
        let line = ''
        
        // Iterate through words, creating new lines when necessary
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = context.measureText(testLine)
            const testWidth = metrics.width
            if (testWidth > maxWidth && n > 0) {
                // If the line is too wide, draw the current line and start a new one
                context.fillText(line, x, y)
                line = words[n] + ' '
                y += lineHeight
            } else {
                // If the line fits, add the current word
                line = testLine
            }
        }
        // Draw the last line
        context.fillText(line, x, y)
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
        this.updateTypewriterText()
    }
}