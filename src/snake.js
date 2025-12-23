import * as THREE from 'three';

const leftTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1), Math.PI / 2
);

const rightTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1), - Math.PI / 2
);

const upTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0), Math.PI / 2
);

const downTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0), - Math.PI / 2
);

const defaultForward = new THREE.Vector3(0, 0, 1);
const defaultLeft = new THREE.Vector3(1, 0, 0);
const defaultUp = new THREE.Vector3(0, 1, 0);

class Snake {
    constructor(
        startPosition=new THREE.Vector3(),
        length=20,
        orientation=new THREE.Quaternion()
    ) {
        this.positions = [startPosition];
        this.length = length
        this.orientation = orientation;
    }

    step() {
        // Get first position in list
        const currentPos = this.positions[0];

        // Calculate next position
        const nextPos = currentPos.clone().add(this.getForwardDirection());

        // Add nextPos to the front of the list
        this.positions.splice(0, 0, nextPos);

        // Trim to correct length
        while (this.positions.length > this.length) {
            this.positions.pop();
        }
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