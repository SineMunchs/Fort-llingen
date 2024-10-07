import * as THREE from 'three' // Import the entire Three.js library
import { SpotLightHelper } from 'three' // Import SpotLightHelper specifically

export default class Scene1 {
    constructor() {
        // Create a new group to hold all elements of this scene
        this.group = new THREE.Group()
        
        // Set up the geometry and lighting for this scene
        this.createGeometry()
        this.createLight()
        
        // Set up position data for scene transitions
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(20, 0, 0),  // Position to enter from
            unmountToPosition: new THREE.Vector3(-10, 0, 0)  // Position to exit to
        })
    }

    createGeometry() {
        // Create a simple cube geometry
        const geometry = new THREE.BoxGeometry()
        // Create a green material for the cube
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
        // Create a mesh using the geometry and material
        this.cube = new THREE.Mesh(geometry, material)

        // Set the cube's position to be higher
    this.cube.position.set(0, 2, 0)  // Moves the cube 2 units up along the y-axis
    
        // Add the cube to the scene group
        this.group.add(this.cube)
    }

    updateUserData(userData) {
        // Update the group's userData (used for scene management)
        this.group.userData = userData
    }

    createLight() {
        // Add ambient light to the scene for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
        this.group.add(ambientLight)

        // Add a spotlight for more focused lighting
        const spotLight = new THREE.SpotLight(0xffffff, 8, 10, Math.PI / 4, 0.1, 2)
        spotLight.position.set(0, 4, 1)  // Position the spotlight
        this.group.add(spotLight)

        // Create a helper to visualize the spotlight (currently not added to the scene)
        this.spotLightHelper = new SpotLightHelper(spotLight)
        // this.group.add(this.spotLightHelper)  // Uncomment to add the helper to the scene
    }

    update() {
        // Rotate the cube slightly on each frame
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01
    }
}