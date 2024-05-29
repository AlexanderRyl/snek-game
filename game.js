const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
let tileSize = 20;
let maze, player, finish;
let moves = 0;
let timer = 0;
let interval;
let timerStarted = false;
let level = 1;
let rows = 20; // Initial maze size
let cols = 20; // Initial maze size
const moveSound = new Audio('walk.mp3');
const winSound = new Audio('win.mp3');

function generateMaze(rows, cols) {
    const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    const stack = [];
    const start = { x: 0, y: 0 };
    stack.push(start);
    maze[start.y][start.x] = 0;

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const directions = shuffle([
            { x: current.x + 2, y: current.y },
            { x: current.x - 2, y: current.y },
            { x: current.x, y: current.y + 2 },
            { x: current.x, y: current.y - 2 }
        ]).filter(({ x, y }) =>
            x >= 0 && y >= 0 && x < cols && y < rows && maze[y][x] === 1);

        if (directions.length > 0) {
            const next = directions[0];
            maze[next.y][next.x] = 0;
            maze[(next.y + current.y) / 2][(next.x + current.x) / 2] = 0;
            stack.push(next);
        } else {
            stack.pop();
        }
    }
    return maze;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomPosition(maze) {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
    } while (maze[position.y][position.x] === 1); // Ensure not a wall
    return position;
}

function initializeGame() {
    maze = generateMaze(rows, cols);
    player = getRandomPosition(maze);
    finish = getRandomPosition(maze);
    while (finish.x === player.x && finish.y === player.y) {
        finish = getRandomPosition(maze); // Ensure finish is not same as player
    }
    moves = 0;
    timer = 0;
    timerStarted = false;
    clearInterval(interval);
    drawMaze();
    document.getElementById('timer').innerText = `Time: ${timer}s`;
    document.getElementById('moves').innerText = `Moves: ${moves}`;
}

function updateTimer() {
    timer++;
    document.getElementById('timer').innerText = `Time: ${timer}s`;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            ctx.fillStyle = cell === 1 ? '#000' : '#ccc'; // Improved colors
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });
    });
    ctx.fillStyle = '#00f'; // Blue for player
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
    ctx.fillStyle = '#0f0'; // Green for finish
    ctx.fillRect(finish.x * tileSize, finish.y * tileSize, tileSize, tileSize);
}

function movePlayer(dx, dy) {
    if (!timerStarted) {
        timerStarted = true;
        interval = setInterval(updateTimer, 1000);
    }
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        moves++;
        document.getElementById('moves').innerText = `Moves: ${moves}`;
        playMoveSound();
        if (player.x === finish.x && player.y === finish.y) {
            clearInterval(interval);
            playWinSound();
            saveStats(level, timer, moves);
            alert(`Level ${level} completed in ${timer} seconds with ${moves} moves!`);
            level++;
            if (level % 10 === 0) {
                rows++;
                cols++;
                tileSize = Math.max(5, tileSize - 1); // Adjust tile size to fit
                canvas.width = cols * tileSize;
                canvas.height = rows * tileSize;
            }
            initializeGame();
        }
        drawMaze();
    }
}

function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.play();
}

function playWinSound() {
    winSound.play();
}

function saveStats(level, time, moves) {
    const stats = document.getElementById('levelStats');
    const statEntry = document.createElement('p');
    statEntry.innerText = `Level ${level}: Time - ${time}s, Moves - ${moves}`;
    stats.appendChild(statEntry);
    document.getElementById('statsPopup').style.display = 'block';
}

document.getElementById('up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(1, 0));

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'w') {
        movePlayer(0, -1);
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        movePlayer(0, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        movePlayer(-1, 0);
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        movePlayer(1, 0);
    }
});

document.getElementById('closeStats').addEventListener('click', () => {
    document.getElementById('statsPopup').style.display = 'none';
});

initializeGame();
