
import * as THREE from 'three';

import {OrbitControls} from "three/addons/controls/OrbitControls.js";

class View {

    constructor(canvas, snake) {
        this.canvas = canvas;
        this.snake = snake;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientWidth;

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

        this.camera.position.copy(this.snake.positions[0].clone().sub(this.snake.direction));

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        this.scene.add(this.ambientLight);

        // Update canvas and renderer when window is resized
        window.onresize = () => {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.camera.aspect = this.canvas.width / this.canvas.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.width, this.canvas.height);
        };

        this.snakeView = new SnakeView(this.snake, this.scene);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(0, 0.5, 0);

        this.prevStepTime = 0;

        this.renderer.setAnimationLoop(time=>this.animate(time));
    }

    animate(time) {
        if (time - this.prevStepTime > 1000) {
            this.snake.step();
            this.prevStepTime = time;
        }
        this.snakeView.update();
        this.renderer.render(this.scene, this.camera);
    }
}

class SnakeView {
    constructor(snake, scene) {
        this.snake = snake;
        this.scene = scene;
        this.cubes = [];

        this.cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
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