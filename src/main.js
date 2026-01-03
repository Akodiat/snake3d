import * as THREE from 'three';
import {SnakeGame} from './snakeGame.js';
import {MultiplayerSnakeGame} from './multiplayer/multiplayerSnakeGame.js';

const canvas = document.getElementById("threeCanvas");

const searchParams = new URLSearchParams(window.location.search);
if (searchParams.has("peerId")) {
    document.getElementById("startModal").open = false;
    startMultiplayer(searchParams.get("peerId"));
}

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startModal").open = false;
    startSinglePlayer();
});

document.getElementById("startMultiPlayerButton").addEventListener("click", () => {
    document.getElementById("startModal").open = false;
    startMultiplayer();
});

function startSinglePlayer() {
    const foodCount = 1;
    const obstacleCount = 0;
    const box = new THREE.Vector3(10, 10, 10);

    new SnakeGame(canvas, foodCount, obstacleCount, box);
}

function startMultiplayer(peerId) {
    const foodCount = 1;
    const obstacleCount = 0;
    const box = new THREE.Vector3(10, 10, 10);

    new MultiplayerSnakeGame(canvas, foodCount, obstacleCount, box, peerId);
}