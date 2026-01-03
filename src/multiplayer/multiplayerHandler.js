/* global Peer */

import * as THREE from "three";
import {RemoteSnake} from "./remoteSnake.js";
import { collides } from "../utils.js";

class MultiplayerHandler {
    constructor(game, log=msg=>console.log(msg)) {
        this.log = log;
        this.game = game;
        this.peers = new Map();
        this.snakes = new Map();

        const peerId = localStorage.getItem("peerId");

        this.peer = new Peer(peerId);

        this.peer.on("open", id => {
            this.id = id;
            localStorage.setItem("peerId", id);
            this.log("Connection open");

            const href = `${window.location.href.split("?")[0]}?peerId=${id}`;
            this.log(`Ask other players to join through this link: <a href="${href}">${href}</a>`);

            new QRCode(document.getElementById("qrcode"), href);

            document.getElementById(
                "multiplayerHostStartButton"
            ).hidden = false;
        });

        // When someone connects to us
        this.peer.on("connection", conn => {
            conn.on("error", err=>{
                this.log("Connection error:");
                this.log(err);
            });
            conn.on("open", () => {
                //this.log(`Peer ${conn.peer} connected to us`);
                this.peers.set(conn.peer, conn);
                conn.send({
                    type: "hello",
                    peerIndex: this.peers.size,
                    playerName: "host",
                    boundingBox: this.game.boundingBox.toArray(),
                    positions: this.game.snake.positions.map(p=>p.toArray()),
                    orientation: this.game.snake.orientation.toArray()
                });
            });
            conn.on("data", data => {
                this.onData(data, conn.peer);
                // Forward data to other peers
                for (const [id, conn2] of this.peers) {
                    if (conn.peer !== id) {
                        conn2.send(data);
                    }
                }
            });

        });
    }

    onData(data, peerId) {
        if (data.type === "hello") {
            this.log(`${data.playerName} joined the game!`);
            const boundingBox = new THREE.Vector3().fromArray(data.boundingBox)
            if (!boundingBox.equals(this.game.boundingBox)) {
                console.error(
                    `Peer's bounding box of different size! ${
                        boundingBox.toArray().join(",")
                    } != ${
                        this.game.boundingBox.toArray().join(",")
                    }`
                );
                return;
            }

            const positions = data.positions.map(p=>new THREE.Vector3().fromArray(p));
            const orientation = new THREE.Quaternion().fromArray(data.orientation);

            const snake = new RemoteSnake(
                boundingBox,
                positions,
                orientation
            );

            snake.name = data.playerName;

            // Add new snake
            this.snakes.set(peerId, snake);
            this.game.addRemoteSnake(snake);
        }
        else if (data.type === "start") {
            this.game.stepIndex = 0;
            this.game.snake.paused = false;
        }
        else if (data.type === "step") {
            const snake = this.snakes.get(peerId);

            const positions = data.positions.map(p=>new THREE.Vector3().fromArray(p));
            const orientation = new THREE.Quaternion().fromArray(data.orientation);

            console.log(`Got step index ${data.stepIndex}`)

            snake.addStep(data.stepIndex, positions, orientation);
        }
        else if (data.type === "foodCapture") {
            const p1 = new THREE.Vector3().fromArray(data.foodPosition);
            const p2 = new THREE.Vector3().fromArray(data.newFoodPosition);
            this.game.obstacles.addObstacle(p1);
            const i = this.game.food.positions.findIndex(fp=>collides(p1, fp));
            if (i < 0) {
                this.game.food.positions.push(p2);
            } else {
                this.game.food.positions[i] = p2;
            }
            console.log(this.game.food.positions.length)

        } else {
            this.log(`Unknown data type: ${data.type}`)
        }
    }

    sendStart() {
        const message = {
            type: "start"
        }
        for (const conn of this.peers.values()) {
            conn.send(message);
        }
    }

    sendStep(stepIndex, snake) {
        const message = {
            type: "step",
            stepIndex: stepIndex,
            positions: snake.positions.map(p=>p.toArray()),
            orientation: snake.orientation.toArray()
        }
        for (const conn of this.peers.values()) {
            conn.send(message);
        }
    }

    sendFoodCapture(stepIndex, foodPosition, newFoodPosition) {
        const message = {
            type: "foodCapture",
            stepIndex: stepIndex,
            foodPosition: foodPosition.toArray(),
            newFoodPosition: newFoodPosition.toArray(),
        }
        for (const conn of this.peers.values()) {
            conn.send(message);
        }
    }

    connectToPeer(destPeerId, playerName) {
        this.log(`Trying to connect to peer ${destPeerId}`);

        if (!this.peer) {
            this.log("Our own peer not started yet");
        }

        this.peer.on("error", err=>{
            if (err.type === 'peer-unavailable') {
                this.log(`Failed to connect to peer ${destPeerId}`);
            } else {
                this.log(err);
            }
        })
        const conn = this.peer.connect(destPeerId);

        conn.on("open", () => {
            this.peers.set(conn.peer, conn);
            this.log(`Connected to peer id ${destPeerId}`);

            const message = {
                type: "hello",
                playerName: playerName,
                boundingBox: this.game.boundingBox.toArray(),
                positions: this.game.snake.positions.map(p=>p.toArray()),
                orientation: this.game.snake.orientation.toArray()
            }
            for (const conn of this.peers.values()) {
                conn.send(message);
            }
            // Receive messages
            conn.on("data", data => {
                this.onData(data, destPeerId);
                /*
                // Forward data to other peers
                for (const [id, conn2] of this.peers) {
                    if (conn.peer !== id) {
                        conn2.send(data);
                    }
                }
                */
            });
        }).on("error", err=>{
            this.log("Error:");
            this.log(err);
            callback();
        })
    }
}

export {MultiplayerHandler}
