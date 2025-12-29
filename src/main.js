import * as THREE from 'three';

import {View} from "./view.js";
import {Controller} from "./controller.js";

import {Snake} from "./model/snake.js";
import {Food} from "./model/food.js";
import {Obstacles} from './model/obstacles.js';

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startModal").open = false;
    start();
})

function start() {
    const canvas = document.getElementById("threeCanvas");

    const foodCount = 1;
    const obstacleCount = 0;

    const box = new THREE.Vector3(10, 10, 10);

    const snake = new Snake(box);

    const food = new Food(foodCount, box);

    const obstacles = new Obstacles(obstacleCount, box);

    const view = new View(canvas, snake, food, obstacles);

    const controller = new Controller(canvas, snake, food, obstacles);
}