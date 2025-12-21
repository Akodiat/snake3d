import { Snake } from "./snake.js";
import { View } from "./view.js";

const snake = new Snake();

new View(document.getElementById("threeCanvas"), snake);