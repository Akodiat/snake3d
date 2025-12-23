
import * as THREE from 'three';

import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const tempQ1 = new THREE.Quaternion();
const tempQ2 = new THREE.Quaternion();

class View {

    constructor(canvas, snake, food) {
        this.canvas = canvas;
        this.snake = snake;
        this.food = food;
        this.canvas.width =  window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas,
            alpha: true
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, this.canvas.width / this.canvas.height, 0.1, 1000
        );

        this.camera.position.copy(this.snake.positions[0].clone().sub(this.snake.getForwardDirection()));

        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(light);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        this.scene.add(this.ambientLight);

        // Update canvas and renderer when window is resized
        window.onresize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.camera.aspect = this.canvas.width / this.canvas.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.width, this.canvas.height);
        };

        this.snakeView = new SnakeView(this.snake, this.scene);
        this.foodView = new FoodView(this.food, this.scene);

        this.prevStepTime = 0;

        this.renderer.setAnimationLoop(time=>this.animate(time));
    }

    animate(time) {
        if (time - this.prevStepTime > 1000) {
            this.snake.step();
            this.prevStepTime = time;
        }

        this.camera.position.lerp(
            this.snake.getUpDirection().multiplyScalar(5).add(
                this.snake.positions[0]
            ).sub(this.snake.getForwardDirection().multiplyScalar(5)),
        0.05);
        this.camera.up.lerp(this.snake.getUpDirection(), 0.1);

        tempQ1.copy(this.camera.quaternion);
        this.camera.lookAt(this.snake.positions[0]);
        tempQ2.copy(this.camera.quaternion);
        this.camera.quaternion.copy(tempQ1);
        this.camera.quaternion.slerp(tempQ2, 0.1);

        this.snakeView.update();
        this.foodView.update();
        this.renderer.render(this.scene, this.camera);
    }
}

class FoodView {
    constructor(food, scene) {
        this.food = food;
        this.scene = scene;
        this.cubes = [];

        this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.cubeMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff});
    }

    update() {
        for (let i=0; i<this.food.positions.length; i++) {
            if (this.cubes[i] === undefined) {
                this.cubes[i] = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
                this.scene.add(this.cubes[i]);
            }
            this.cubes[i].position.copy(this.food.positions[i]);
        }

        // Remove any extra cubes
        while (this.cubes.length > this.food.positions.length) {
            const extraCube = this.cubes.pop();
            this.scene.remove(extraCube);
        }
    }
}

class SnakeView {
    constructor(snake, scene) {
        this.snake = snake;
        this.scene = scene;
        this.cubes = [];

        this.cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.cubeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
    }

    update() {
        for (let i=0; i<this.snake.positions.length; i++) {
            if (this.cubes[i] === undefined) {
                this.cubes[i] = new THREE.Mesh(this.cubeGeometry, this.cubeMaterial);
                this.scene.add(this.cubes[i]);
            }
            this.cubes[i].position.copy(this.snake.positions[i]);
        }

        // Remove any extra cubes
        while (this.cubes.length > this.snake.positions.length) {
            const extraCube = this.cubes.pop();
            this.scene.remove(extraCube);
        }
    }
}

export {View}