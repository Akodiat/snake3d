import * as THREE from 'three';
import {View, ModelView} from "../view.js";

import {mooreNeighbourhood} from '../utils.js';

function getColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,65%)`;
}

class MultiplayerView extends View {
    constructor(canvas, snake, food, obstacles) {
        super(canvas, snake, food, obstacles);
        this.remoteSnakes = [];
    }

    addRemoteSnake(snake, playerIndex) {
        const remoteSnakeMaterial = new THREE.MeshStandardMaterial({
            color: getColor(playerIndex)
        });

        for (const n of mooreNeighbourhood) {
            const displacement = n.clone().multiply(this.snake.boundingBox);
            const remoteSnakeView = new ModelView(
                snake, this.cubeGeometry, remoteSnakeMaterial, displacement
            );
            this.modelViews.push(remoteSnakeView);
            this.scene.add(remoteSnakeView);
        }

    }
}

export {MultiplayerView}