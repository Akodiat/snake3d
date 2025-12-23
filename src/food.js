import * as THREE from 'three';

function getRandomInt(maxVal) {
  return Math.floor(Math.random() * maxVal);
}

class Food {
    constructor(count, boundingBox) {
        this.boundingBox = boundingBox
        this.positions = [];
        for (let i=0; i<count; i++) {
            this.addFood();
        }
    }
    addFood() {
        this.positions.push(
            new THREE.Vector3(
                getRandomInt(this.boundingBox.x),
                getRandomInt(this.boundingBox.y),
                getRandomInt(this.boundingBox.z)
            )
        )
    }
}

export {Food}