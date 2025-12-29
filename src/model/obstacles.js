import * as THREE from 'three';
import {getRandomInt} from '../utils.js';

class Obstacles {
    constructor(count, boundingBox) {
        this.boundingBox = boundingBox
        this.positions = [];
        for (let i=0; i<count; i++) {
            this.addObstacle();
        }
        console.log(`Added  ${this.positions.length} obstacles`);
    }
    addObstacle(position) {
        if (position === undefined) {
            position = new THREE.Vector3(
                getRandomInt(this.boundingBox.x),
                getRandomInt(this.boundingBox.y),
                getRandomInt(this.boundingBox.z)
            )
        }
        this.positions.push(position);
    }
}

export {Obstacles}