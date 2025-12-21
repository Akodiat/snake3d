import * as THREE from 'three';

const leftTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0), Math.PI / 2
);

const rightTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),  - Math.PI / 2
);

const upTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0), Math.PI / 2
);

const downTurn = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),  - Math.PI / 2
);

class Snake {
    constructor(
        startPosition=new THREE.Vector3(),
        length=3,
        direction = new THREE.Vector3(0, 1, 0)
    ) {
        this.positions = [startPosition];
        this.length = length
        this.direction = direction;
    }

    step() {
        // Get first position in list
        const currentPos = this.positions[0];

        // Calculate next position
        const nextPos = currentPos.clone().add(this.direction);

        // Add nextPos to the front of the list
        this.positions.splice(0, 0, nextPos);

        // Trim to correct length
        while (this.positions.length > this.length) {
            this.positions.pop();
        }
    }

    turn(quaternion) {
        this.direction.applyQuaternion(quaternion);
    }

    turnLeft() {
        this.turn(leftTurn);
    }

    turnRight() {
        this.turn(rightTurn);
    }

    turnUp() {
        this.turn(upTurn);
    }

    turnDown() {
        this.turn(downTurn);
    }
}

export {Snake}