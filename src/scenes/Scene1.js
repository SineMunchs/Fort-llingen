import * as THREE from 'three'
import { SpotLightHelper } from 'three'

export default class Scene1 {
    constructor() {
        // Create a new group to hold all elements of this scene
        this.group = new THREE.Group()
        
        // Set up the geometry and lighting for this scene
        this.createGeometry()
        this.createLight()
        
        // Add fog to the scene
        this.createFog()
        
        // Set up position data for scene transitions
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(20, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        })
    }

    createGeometry() {
        const geometry = new THREE.BoxGeometry()
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        this.cube = new THREE.Mesh(geometry, material)
        this.cube.position.set(0, 2, 0)
        this.group.add(this.cube)
    }

    updateUserData(userData) {
        this.group.userData = userData
    }

    createLight() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
        this.group.add(ambientLight)

        const spotLight = new THREE.SpotLight(0xffffff, 8, 10, Math.PI / 4, 0.1, 2)
        spotLight.position.set(0, 4, 1)
        this.group.add(spotLight)

        this.spotLightHelper = new SpotLightHelper(spotLight)
        // this.group.add(this.spotLightHelper)
    }

    createFog() {
        // Create fog and add it to the group
        this.fog = new THREE.Fog(0x000000, 0, 100)
        this.group.fog = this.fog
    }

    update() {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
    }
}

