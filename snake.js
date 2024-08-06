<!DOCTYPE html>
<html>
<head>
    <title>Snake Game</title>
    <style>
        #gameCanvas {
            display: block;
            margin: auto;
            background: #000;
            border: 2px solid #fff;
        }
        .game-over {
            text-align: center;
            font-size: 24px;
            color: white;
            display: none;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <div id="gameOver" class="game-over">Game Over<br>Press R to Restart</div>

    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        const box = 20;
        const canvasSize = 20;
        let snake = [];
        snake[0] = { x: 9 * box, y: 10 * box };

        let food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };

        let score = 0;
        let d;
        let gameOver = false;

        document.addEventListener('keydown', direction);
        document.addEventListener('keydown', restartGame);

        function direction(event) {
            if (event.keyCode == 37 && d != 'RIGHT') {
                d = 'LEFT';
            } else if (event.keyCode == 38 && d != 'DOWN') {
                d = 'UP';
            } else if (event.keyCode == 39 && d != 'LEFT') {
                d = 'RIGHT';
            } else if (event.keyCode == 40 && d != 'UP') {
                d = 'DOWN';
            }
        }

        function restartGame(event) {
            if (event.keyCode == 82 && gameOver) { // 'R' key
                gameOver = false;
                document.getElementById('gameOver').style.display = 'none';
                score = 0;
                snake = [{ x: 9 * box, y: 10 * box }];
                d = undefined;
                food = {
                    x: Math.floor(Math.random() * canvasSize) * box,
                    y: Math.floor(Math.random() * canvasSize) * box
                };
                game = setInterval(draw, 100);
            }
        }

        function collision(newHead, array) {
            for (let i = 0; i < array.length; i++) {
                if (newHead.x == array[i].x && newHead.y == array[i].y) {
                    return true;
                }
            }
            return false;
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < snake.length; i++) {
                ctx.fillStyle = (i == 0) ? 'green' : 'white';
                ctx.fillRect(snake[i].x, snake[i].y, box, box);
                ctx.strokeStyle = 'red';
                ctx.strokeRect(snake[i].x, snake[i].y, box, box);
            }

            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, box, box);

            let snakeX = snake[0].x;
            let snakeY = snake[0].y;

            if (d == 'LEFT') snakeX -= box;
            if (d == 'UP') snakeY -= box;
            if (d == 'RIGHT') snakeX += box;
            if (d == 'DOWN') snakeY += box;

            if (snakeX == food.x && snakeY == food.y) {
                score++;
                food = {
                    x: Math.floor(Math.random() * canvasSize) * box,
                    y: Math.floor(Math.random() * canvasSize) * box
                };
            } else {
                snake.pop();
            }

            let newHead = {
                x: snakeX,
                y: snakeY
            };

            if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
                clearInterval(game);
                gameOver = true;
                document.getElementById('gameOver').style.display = 'block';
            }

            snake.unshift(newHead);

            ctx.fillStyle = 'white';
            ctx.font = '45px Changa one';
            ctx.fillText(score, 2 * box, 1.6 * box);
        }

        let game = setInterval(draw, 100);
    </script>
</body>
</html>
