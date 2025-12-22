import {Snake} from "./snake.js";
import {View} from "./view.js";
import {Controller} from "./controller.js";

const canvas = document.getElementById("threeCanvas");

const snake = new Snake();

const view = new View(canvas, snake);

const controller = new Controller(snake, view);