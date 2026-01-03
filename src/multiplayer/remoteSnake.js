import {Snake} from "../model/snake.js";

class RemoteSnake extends Snake {
    constructor(boundingBox, positions, orientation) {
        super(
            boundingBox,
            positions[0],
            positions.length,
            orientation
        );
        this.positions = positions;
        this.steps = new Map();
    }

    addStep(stepIndex, positions, orientation) {
        this.steps.set(stepIndex, {positions, orientation});
    }

    step(stepIndex) {
        if (!this.steps.has(stepIndex)) {
            stepIndex = Math.max(...[...this.steps.keys()].filter(i=>i<stepIndex));
            if (!this.steps.has(stepIndex)) {
                return;
            }
        }
        const {positions, orientation} = this.steps.get(stepIndex);
        this.steps.delete(stepIndex);
        this.positions.length = 0;
        this.positions.push(...positions);
        this.orientation.copy(orientation);
    }
}

export {RemoteSnake}