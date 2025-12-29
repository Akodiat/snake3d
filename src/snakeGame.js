import {TouchHandler} from "./touchHandler.js";
import {Vector3} from 'three';
import {getRandomInt} from './utils.js';
import {View} from "./view.js";

import {Snake} from "./model/snake.js";
import {Food} from "./model/food.js";
import {Obstacles} from './model/obstacles.js';

function collides(p1, p2) {
    return p1.distanceToSquared(p2) < 0.1;
}

class SnakeGame {
    constructor(canvas, foodCount, obstacleCount, box) {

        // Create models for snake, food, and obstacles
        this.snake = new Snake(box);
        this.food = new Food(foodCount, box);
        this.obstacles = new Obstacles(obstacleCount, box);

        // Create view
        this.view = new View(canvas, this.snake, this.food, this.obstacles);

        // Add keyboard controls
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "w": this.snake.turnDown(); break;
                case "s": this.snake.turnUp(); break;
                case "a": this.snake.turnLeft(); break;
                case "d": this.snake.turnRight(); break;
                case "q": this.snake.rollLeft(); break;
                case "e": this.snake.rollRight(); break;

                case "ArrowUp": this.snake.turnDown(); break;
                case "ArrowDown": this.snake.turnUp(); break;
                case "ArrowLeft": this.snake.turnLeft(); break;
                case "ArrowRight": this.snake.turnRight(); break;
                case "PageUp": this.snake.rollLeft(); break;
                case "PageDown": this.snake.rollRight(); break;

                default: console.log(event.key); break;
            }
        });

        // Add touch controls
        const touchHandler = new TouchHandler(canvas);
        touchHandler.addEventListener("swipeUp", () => this.snake.turnUp());
        touchHandler.addEventListener("swipeDown", () => this.snake.turnDown());
        touchHandler.addEventListener("swipeLeft", () => this.snake.turnLeft());
        touchHandler.addEventListener("swipeRight", () => this.snake.turnRight());
        touchHandler.addEventListener("tapRight", () => this.snake.rollLeft());
        touchHandler.addEventListener("tapLeft", () => this.snake.rollRight());

        // Handle new steps
        this.snake.addEventListener("step", () => {
            // Check for self collision
            const ps = this.snake.positions;
            for (let i=1; i<ps.length; i++) {
                if (collides(ps[0], ps[i])) {
                    handleGameOver(`Game over! You collided with yourself. You got ${this.snake.length} points!`, this.snake);
                    break;
                }
            }

            // Check for obstacle collision
            const os = this.obstacles.positions;
            for (let i=0; i<os.length; i++) {
                if (collides(ps[0], os[i])) {
                    handleGameOver(`Game over! You collided with an obstacle. You got ${this.snake.length} points!`, this.snake);
                    break;
                }
            }

            // Check for food collision
            const fs = this.food.positions;
            for (let i=0; i<fs.length; i++) {
                if (collides(ps[0], fs[i])) {
                    this.snake.length++;
                    this.obstacles.addObstacle(ps[0]);
                    this.food.positions.splice(i,1); // Remove

                    // Find a new random position
                    // that is not already occupied
                    let newPos;
                    do {
                        newPos = new Vector3(
                            getRandomInt(this.snake.boundingBox.x),
                            getRandomInt(this.snake.boundingBox.y),
                            getRandomInt(this.snake.boundingBox.z)
                        );
                    } while ([
                        ...this.obstacles.positions,
                        ...this.snake.positions,
                        ...this.food.positions
                    ].some(p => collides(p, newPos)));

                    this.food.addFood(newPos); // Add on new location
                    console.log("Food");
                    break;
                }
            }

        });
    }
}

function handleGameOver(text, snake) {
    let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));
    if (leaderBoard == null) {
        leaderBoard = [];
    }

    const points = snake.length;

    let tmpLeaderBoard = leaderBoard.slice();
    tmpLeaderBoard.push({
        name: "[Current game]",
        points: points
    });
    tmpLeaderBoard.sort((a,b)=>b.points - a.points);
    tmpLeaderBoard = tmpLeaderBoard.slice(0, 5);

    document.getElementById("leaderBoard").innerHTML = tmpLeaderBoard.map(i=>
        `<p>${i.points}p: ${i.name}</p>`
    ).join("");

    document.getElementById("gameOverText").innerHTML = text;
    document.getElementById("gameOver").open = true;
    document.getElementById("retryButton").addEventListener("click", () => {
        document.getElementById("gameOver").open = false;
        const name = document.getElementById("name").value;
        leaderBoard.push({
            name: name,
            points: points
        });
        localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
        snake.reset();
    });
    snake.reset();
}

export {SnakeGame}