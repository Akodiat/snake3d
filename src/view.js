
import * as THREE from 'three';
import {mooreNeighbourhood} from './utils.js';

const tempQ1 = new THREE.Quaternion();
const tempQ2 = new THREE.Quaternion();

const origin = new THREE.Vector3();

class View {

    constructor(canvas, snake, food, obstacles) {
        this.canvas = canvas;
        this.snake = snake;
        this.food = food;
        this.obstacles = obstacles;
        this.canvas.width =  window.innerWidth;
        this.canvas.height = window.innerHeight;


        // Setup scene

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

        // The camera should always look at the origin (we move the world to
        // keep the snake head at the origin (see animate()))
        this.camera.position.copy(origin.clone().sub(this.snake.getForwardDirection()));
        this.camera.lookAt(origin);

        const pointLight = new THREE.PointLight(0xffffff, 100);
        pointLight.position.set(10, 3, 2);
        this.scene.add(pointLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(hemisphereLight);

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

        // Define geometries and materials here. Reuse them later.

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const snakeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const foodMaterial  = new THREE.MeshStandardMaterial({color: 0x00ffff});
        const obstacleMaterial  = new THREE.MeshStandardMaterial({color: 0xff0000});


        // A single modelview for each type of item would be enought,
        // but we want to see what is behind the other side of the
        // periodic boundary, so we add 26 duplicates on each side
        // of the box cube.

        this.modelViews = [];
        for (const n of mooreNeighbourhood) {
            const displacement = n.clone().multiply(this.snake.boundingBox);
            const snakeView = new ModelView(this.snake, cubeGeometry, snakeMaterial, displacement, 1.0);
            const foodView = new ModelView(this.food, cubeGeometry, foodMaterial, displacement, 1.0);
            const obstacleView = new ModelView(this.obstacles, cubeGeometry, obstacleMaterial, displacement, 0.9);
            this.modelViews.push(snakeView, foodView, obstacleView);
            this.scene.add(snakeView, foodView, obstacleView);
        }

        // Make fog colour match background (in both dark and light mode)
        let bgColor = getComputedStyle(document.body).getPropertyValue('--pico-background-color');
        bgColor = bgColor.replace(/\.\d+/g,"") // Pico.css colours have decimals??
        this.scene.fog = new THREE.Fog(
            new THREE.Color(bgColor),
            this.snake.boundingBox.x,
            this.snake.boundingBox.x * 1.5
        );

        this.prevStepTime = 0;

        this.renderer.setAnimationLoop(time=>this.animate(time));
    }

    animate(time) {
        // Step every second
        if (time - this.prevStepTime > 1000) {
            this.snake.step();
            this.prevStepTime = time;

            // Update all model views (including duplicates)
            for (const v of this.modelViews) {
                v.update();
            }
        };

        // Position camera to look where the snake is headed
        const newCamPos = this.snake.getUpDirection().multiplyScalar(5).sub(
            this.snake.getForwardDirection().multiplyScalar(5)
        );
        this.camera.position.lerp(newCamPos, 0.05);
        this.camera.up.lerp(this.snake.getUpDirection(), 0.1);
        this.camera.lookAt(origin);

        // Lerp all model view positions (including duplicates)
        for (const v of this.modelViews) {
            // Move world to snake instead of snake to world
            // (this makes camera movement easier across boundaries)
            const nextPos = this.snake.positions[0].clone().negate();

            // If we pass across a boundary, first move to one step
            // behind the opposite boundary to get smoother lerping.
            if (v.position.distanceToSquared(nextPos) > 2) {
                v.position.copy(nextPos);
                v.position.add(this.snake.getForwardDirection());
            }
            v.position.lerp(nextPos, 0.05);
        }
        this.renderer.render(this.scene, this.camera);
    }
}

class ModelView extends THREE.Group {
    constructor(model, geometry, material, displacement = new THREE.Vector3(), scaleFactor=1) {
        super();
        this.model = model;
        this.cubes = [];

        this.geometry = geometry;
        this.material = material;
        this.displacement = displacement;
        this.scaleFactor = scaleFactor;
    }

    update() {
        for (let i=0; i<this.model.positions.length; i++) {
            if (this.cubes[i] === undefined) {
                // Add more cubes as neccesary
                this.cubes[i] = new THREE.Mesh(this.geometry, this.material);
                this.cubes[i].scale.multiplyScalar(this.scaleFactor);
                this.add(this.cubes[i]);
            }
            // Update positions
            this.cubes[i].position.copy(this.model.positions[i]);
            this.cubes[i].position.add(this.displacement);
        }

        // Remove any extra cubes
        while (this.cubes.length > this.model.positions.length) {
            const extraCube = this.cubes.pop();
            this.remove(extraCube);
        }
    }
}

export {View}