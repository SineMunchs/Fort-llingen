import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GSAP from 'gsap'

import Scene1 from '../scenes/Scene1'
import Scene2 from '../scenes/Scene2'

/**
 * SceneManager klasse til at håndtere flere scener i en Three.js applikation.
 */
export default class SceneManager {

    stage = null        // Reference til hovedscenen
    scenes = []         // Array til at gemme scenerne
    currentScene = 0    // Indeks for den nuværende scene

    constructor(stageRef) {
        this.stage = stageRef
        this.initScenes()
    }

    // Initialiserer scenerne og tilføjer dem til scenes arrayet.
    initScenes() {
        this.scenes.push(
            new Scene1(), 
            new Scene2()
        )
    }

    /**
     * Monterer en scene på stage.
     * @param {number} sceneId - Indeks for scenen der skal monteres.
     */
    mountScene(sceneId) {
        // Gem reference til scenen
        const scene = this.scenes[sceneId]
        // Sæt scenens position til mountFromPosition
        scene.group.position.copy(scene.group.userData.mountFromPosition)
        // Tilføj scenen til stage
        this.stage.add(scene.group)
        // Animer scenens position til 0, 0, 0
        GSAP.to(scene.group.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
           // ease: 'power2'
        })
    }

    /**
     * Afmonterer en scene fra stage.
     * @param {number} sceneId - Indeks for scenen der skal afmonteres.
     */
    unmountScene(sceneId) {
        // Gem reference til scenen
        const scene = this.scenes[sceneId]
        // Animer scenens position til unmountToPosition
        GSAP.to(scene.group.position, {
            x: scene.group.userData.unmountToPosition.x,
            y: scene.group.userData.unmountToPosition.y,
            z: scene.group.userData.unmountToPosition.z,
            duration: 1,
           // ease: 'power2',
            // Når animationen er færdig, fjern scenen fra stage
            onComplete: () => {
                this.stage.remove(scene.group)
            }
        })
    }

    // Skifter til den næste scene.
    nextScene() {
        this.unmountScene(this.currentScene)
        this.currentScene = (this.currentScene + 1) % this.scenes.length
        this.mountScene(this.currentScene)
    }

    // Skifter til den forrige scene.
    previousScene() {
        this.unmountScene(this.currentScene)
        this.currentScene = (this.currentScene - 1 + this.scenes.length) % this.scenes.length
        this.mountScene(this.currentScene)
    }

    // Opdaterer den nuværende scene.
    updateScene() {
        this.scenes[this.currentScene].update()
    }

}