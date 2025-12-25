import * as THREE from 'three';
import {Snake} from "./snake.js";
import {View} from "./view.js";
import {Controller} from "./controller.js";
import {Food} from "./food.js";

document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startModal").open = false;
    start();
})

function start() {
    const canvas = document.getElementById("threeCanvas");

    const foodCount = 3;
    const box = new THREE.Vector3(10, 10, 10);

    const snake = new Snake(box);

    const food = new Food(foodCount, box);

    const view = new View(canvas, snake, food);

    const controller = new Controller(snake, view, food);
}