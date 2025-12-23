
class Controller {
    constructor(snake, view) {
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
    }
}

export {Controller}