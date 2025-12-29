import * as THREE from 'three';
import {SnakeGame} from './snakeGame.js';

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startModal").open = false;
    start();
})

function start() {
    const canvas = document.getElementById("threeCanvas");

    const foodCount = 1;
    const obstacleCount = 0;

    const box = new THREE.Vector3(10, 10, 10);

    new SnakeGame(canvas, foodCount, obstacleCount, box);
}