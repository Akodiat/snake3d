
function collides(p1, p2) {
    return p1.distanceToSquared(p2) < 0.1;
}

class Controller {
    constructor(snake, view, food, obstacles) {
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "w": snake.turnDown(); break;
                case "s": snake.turnUp(); break;
                case "a": snake.turnLeft(); break;
                case "d": snake.turnRight(); break;
                case "q": snake.rollLeft(); break;
                case "e": snake.rollRight(); break;
                default: console.log(event.key); break;
            }
        });

        snake.addEventListener("step", () => {

            // Check for self collision
            const ps = snake.positions;
            for (let i=1; i<ps.length; i++) {
                if (collides(ps[0], ps[i])) {
                    alert(`Game over! You collided with yourself. You got ${snake.length} points!`);
                    snake.reset();
                    console.log("Collision");
                    break;
                }
            }

            // Check for obstacle collision
            const os = obstacles.positions;
            for (let i=0; i<os.length; i++) {
                if (collides(ps[0], os[i])) {
                    alert(`Game over! You collided with an obstacle. You got ${snake.length} points!`);
                    snake.reset();
                    console.log("Collision");
                    break;
                }
            }

            // Check for food collision
            const fs = food.positions;
            for (let i=0; i<fs.length; i++) {
                if (collides(ps[0], fs[i])) {
                    snake.length++;
                    food.positions.splice(i,1); // Remove
                    food.addFood(); // Add on new location
                    console.log("Food");
                    break;
                }
            }

        });
    }
}

export {Controller}