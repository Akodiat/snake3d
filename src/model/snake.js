import * as THREE from 'three';
import {mod} from '../utils.js';

const defaultForward = new THREE.Vector3(0, 0, 1);
const defaultLeft = new THREE.Vector3(1, 0, 0);
const defaultUp = new THREE.Vector3(0, 1, 0);

class Snake extends EventTarget{
    constructor(box, startPosition, length, orientation) {
        super();
        this.init(box, startPosition, length, orientation)
    }

    init(
        box,
        startPosition,
        length = 1,
        orientation = new THREE.Quaternion()
    ) {
        this.box = box;
        if (startPosition === undefined) {
            startPosition = box.clone().divideScalar(2);
            startPosition.x = Math.floor(startPosition.x);
            startPosition.y = Math.floor(startPosition.y);
            startPosition.z = Math.floor(startPosition.z);
        }
        this.positions = [startPosition];
        this.length = length
        this.orientation = orientation;
    }

    reset() {
        this.init(this.box)
    }

    step() {
        // Get first position in list
        const currentPos = this.positions[0];

        // Calculate next position
        const nextPos = currentPos.clone().add(this.getForwardDirection());

        // Round to integers (to avoid drift)
        nextPos.x = Math.round(nextPos.x);
        nextPos.y = Math.round(nextPos.y);
        nextPos.z = Math.round(nextPos.z);

        // Apply periodic boundary conditions
        nextPos.x = mod(nextPos.x, this.box.x);
        nextPos.y = mod(nextPos.y, this.box.y);
        nextPos.z = mod(nextPos.z, this.box.z);

        console.log(nextPos.toArray().join(","));

        // Add nextPos to the front of the list
        this.positions.splice(0, 0, nextPos);

        // Trim to correct length
        while (this.positions.length > this.length) {
            this.positions.pop();
        }

        const event = new Event("step");
        this.dispatchEvent(event);
    }

    getForwardDirection() {
        return defaultForward.clone().applyQuaternion(this.orientation);
    }

    getUpDirection() {
        return defaultUp.clone().applyQuaternion(this.orientation);
    }

    getLeftDirection() {
        return defaultLeft.clone().applyQuaternion(this.orientation);
    }

    turnLeft() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getUpDirection(), Math.PI / 2
        ));
    }

    turnRight() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getUpDirection(), - Math.PI / 2
        ));
    }

    turnUp() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getLeftDirection(), - Math.PI / 2
        ));
    }

    turnDown() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getLeftDirection(), Math.PI / 2
        ));
    }

    rollLeft() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getForwardDirection(), - Math.PI / 2
        ));
    }

    rollRight() {
        this.orientation.premultiply(new THREE.Quaternion().setFromAxisAngle(
            this.getForwardDirection(), Math.PI / 2
        ));
    }
}

export {Snake}