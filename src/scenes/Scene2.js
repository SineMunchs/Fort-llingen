import * as THREE from 'three'
import { SpotLightHelper } from 'three'
import { Wireframe } from 'three/examples/jsm/Addons.js'

export default class Scene1 {

    constructor() {
        this.group = new THREE.Group()
        this.createGeometry()
        this.createLight()
        this.updateUserData({
            mountFromPosition: new THREE.Vector3(10, 0, 0),
            unmountToPosition: new THREE.Vector3(-10, 0, 0)
        })
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
        // this.group.add(this.spotLightHelper)
    }

    update() {
        this.sphere.rotation.x += 0.01
        this.sphere.rotation.y += 0.01
    }
}