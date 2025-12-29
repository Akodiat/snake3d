import * as THREE from 'three';
import {getRandomInt} from '../utils.js';

class Food {
    constructor(count, boundingBox) {
        this.boundingBox = boundingBox
        this.positions = [];
        for (let i=0; i<count; i++) {
            this.addFood();
        }
        console.log(`Added  ${this.positions.length} food`);
    }
    addFood(position) {
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

export {Food}