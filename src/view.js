
import * as THREE from 'three';
import {mooreNeighbourhood} from './utils.js';

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
        this.camera.lookAt(this.snake.positions[0]);

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

        //const axesHelper = new THREE.AxesHelper(this.snake.box.x);
        //this.scene.add(axesHelper);

        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const snakeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const foodMaterial  = new THREE.MeshStandardMaterial({color: 0x00ffff});

        this.modelViews = [];

        for (const n of mooreNeighbourhood) {
            const displacement = n.clone().multiply(this.snake.box);
            const snakeView = new ModelView(this.snake, cubeGeometry, snakeMaterial, displacement);
            const foodView = new ModelView(this.food, cubeGeometry, foodMaterial, displacement);
            this.modelViews.push(snakeView, foodView);
            this.scene.add(snakeView, foodView);
        }

        this.scene.fog = new THREE.Fog( 0xffffff, this.snake.box.x, this.snake.box.x * 1.5);

        this.prevStepTime = 0;

        this.renderer.setAnimationLoop(time=>this.animate(time));
    }

    animate(time) {
        if (time - this.prevStepTime > 1000) {
            this.snake.step();
            this.prevStepTime = time;
        };

        const newCamPos = this.snake.getUpDirection().multiplyScalar(5).add(
            this.snake.positions[0]
        ).sub(
            this.snake.getForwardDirection().multiplyScalar(5)
        );

        this.camera.position.lerp(newCamPos, 0.05);
        this.camera.up.lerp(this.snake.getUpDirection(), 0.1);

        tempQ1.copy(this.camera.quaternion);
        this.camera.lookAt(this.snake.positions[0]);
        tempQ2.copy(this.camera.quaternion);
        this.camera.quaternion.copy(tempQ1);

        if(tempQ1.angleTo(tempQ2) < Math.PI / 2) {
            this.camera.quaternion.slerp(tempQ2, 0.1);
        } else {
            this.camera.position.copy(newCamPos);
        }

        this.modelViews.forEach(v=>v.update());
        this.renderer.render(this.scene, this.camera);
    }
}

class ModelView extends THREE.Group{
    constructor(model, geometry, material, displacement = new THREE.Vector3()) {
        super();
        this.model = model;
        this.cubes = [];

        this.geometry = geometry;
        this.material = material;
        this.displacement = displacement;
    }

    update() {
        for (let i=0; i<this.model.positions.length; i++) {
            if (this.cubes[i] === undefined) {
                this.cubes[i] = new THREE.Mesh(this.geometry, this.material);
                this.add(this.cubes[i]);
            }
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