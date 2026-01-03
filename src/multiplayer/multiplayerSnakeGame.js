import {SnakeGame} from "../snakeGame.js";
import {MultiplayerHandler} from "./multiplayerHandler.js";
import {Vector3} from "three";
import {getRandomInt, collides} from "../utils.js";
import {MultiplayerView} from "./multiplayerView.js";

class MultiplayerSnakeGame extends SnakeGame {
    constructor(canvas, foodCount, obstacleCount, boundingBox, peerToConnectTo) {
        super(canvas, foodCount, obstacleCount, boundingBox);
        this.remoteSnakes = [];
        this.stepIndex = 0;

        this.snake.paused = true;
        this.multiplayerHandler = new MultiplayerHandler(this, msg=>{
            console.log(msg);
            document.getElementById("multiplayerStatus").innerHTML += `<p>${msg}</p>`;
        });
        if (peerToConnectTo !== undefined) {
            // We are a client connecting to a host
            document.getElementById("multiplayerClient").open = true;
            document.getElementById(
                "multiplayerClientConnectButton"
            ).addEventListener("click", ()=>{
                document.getElementById("multiplayerClient").open = false;
                const name = document.getElementById("multiplayerName").value;
                this.multiplayerHandler.connectToPeer(peerToConnectTo, name);
            })

        } else {
            // We are a host awaiting clients
            this.isHost = true;
            document.getElementById("multiplayerHost").open = true;
            document.getElementById(
                "multiplayerHostStartButton"
            ).addEventListener("click", ()=>{
                document.getElementById("multiplayerHost").open = false;
                this.multiplayerHandler.sendStart();
                this.stepIndex = 0;
                this.snake.paused = false;
            });
        }
    }

    onStep() {
        const onFoodCallback = (oldPos, newPos) => {
            this.multiplayerHandler.sendFoodCapture(this.stepIndex, oldPos, newPos);
        }
        super.onStep(onFoodCallback);

        this.remoteSnakes.forEach(s=>s.step(this.stepIndex));

        // Check for self collision
        const ps = this.snake.positions;
        const rs = this.remoteSnakes.flatMap(s=>s.positions);
        for (let i=1; i<rs.length; i++) {
            if (collides(ps[0], rs[i])) {
                this.handleGameOver(`Game over! You collided with another snake. You got ${this.snake.length} points!`, this.snake);
                break;
            }
        }

        // Sync steps
        this.multiplayerHandler.sendStep(this.stepIndex, this.snake);
        this.stepIndex++;
    }

    addRemoteSnake(snake) {
        this.remoteSnakes.push(snake);
        this.view.addRemoteSnake(snake);
    }

    setupView() {
        this.view = new MultiplayerView(this.canvas, this.snake, this.food, this.obstacles);
    }

    getEmptyPos() {
         // Find a new random position
        // that is not already occupied
        let newPos;
        do {
            newPos = new Vector3(
                getRandomInt(this.boundingBox.x),
                getRandomInt(this.boundingBox.y),
                getRandomInt(this.boundingBox.z)
            );
        } while ([
            ...this.obstacles.positions,
            ...this.snake.positions,
            ...this.food.positions,
            ...[...this.remoteSnakes.values()].flatMap(s=>s.positions)
        ].some(p => collides(p, newPos)));

        return newPos;
    }

    handleGameOver(text, snake) {

        // Just some visual feedback that we died..
        this.view.camera.position.add(this.view.camera.up.clone().multiplyScalar(100));

        console.log(text);
        snake.length = 1;
    }
}


export {MultiplayerSnakeGame}