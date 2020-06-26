let canvas = document.getElementById('canvas');
let canvasRect = canvas.getBoundingClientRect();
let ctx = canvas.getContext('2d');

const BALL_R = 10;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 16;
const PADDLE_POS_Y = canvas.height - PADDLE_THICKNESS - 20;
const BALL_START_X = canvas.width / 2;
const BALL_START_Y = canvas.height / 2;
const BALL_START_BASE_VEL = 10;
const GRID_ROWS = 5;
const GRID_COLS = 10;
const BLOCK_WIDTH = canvas.width / GRID_COLS;
const BLOCK_HEIGHT = 30;
const FPS = 30;

let ballBaseVel = BALL_START_BASE_VEL;
let paused = true;

let grid = new Grid();
let ball = new Ball(BALL_START_X, BALL_START_Y);
let paddle = new Paddle(canvas.width / 2, PADDLE_POS_Y);
let score = 0;

let mouseX = canvas.width / 2;
canvas.addEventListener('mousemove', updateMousePos);
canvas.addEventListener('mouseenter', () => paused = false);
canvas.addEventListener('mouseleave', () => paused = true);

drawAll();
game();

function game() {
	if (!paused) {
		moveAll();
		drawAll();
		updateScore();
	}

	setTimeout(game, 1000 / FPS);
}

function moveAll() {
	paddle.move();
	ball.move();
}

function drawAll() {
	drawBackground();
	paddle.draw();
	ball.draw();
	grid.draw();
}

function drawBackground() {
	drawRect(0, 0, canvas.width, canvas.height, '#000000');
}

function Ball(x, y) {
	this.x = x;
	this.y = y;
	this.vx = ballBaseVel * Math.sin(Math.random() * 2 * Math.PI);
	this.vy = ballBaseVel;

	this.draw = function() {
		drawCircle(this.x, this.y, BALL_R, '#ffffff');
	}

	this.move = function()  {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x >= canvas.width || this.x <= 0) {
			this.vx = -this.vx;
			this.x += this.vx;
		}
		if (this.y <= 0) {
			this.vy = -this.vy;
			this.y += this.vy;
		}

		gridCollType = grid.collision(this.x, this.y, this.x - this.vx, this.y - this.vy);
		if (gridCollType == 1) {
			this.vy = -this.vy;
			this.y += this.vy;
		} else if (gridCollType == 2) {
			this.vx = -this.vx;
			this.x += this.vx;
		} else if (gridCollType == 3) {
			this.vy = -this.vy;
			this.y += this.vy;

			this.vx = -this.vx;
			this.x += this.vx;
		}
		

		if (this.y >= PADDLE_POS_Y && this.y <= PADDLE_POS_Y + PADDLE_THICKNESS) {
			if (this.x >= paddle.x - PADDLE_WIDTH / 2 && this.x <= paddle.x + PADDLE_WIDTH / 2) {
				this.vy = -this.vy;
				this.y += this.vy;
				this.vx = ballBaseVel * Math.sin((this.x - paddle.x) / PADDLE_WIDTH * Math.PI);
			}
		}

		if (this.y >= canvas.height) {
			reset(false);
		}
	}
}

function Paddle(x, y) {
	this.x = x;
	this.y = y;

	this.draw = function() {
		drawRect(this.x - PADDLE_WIDTH / 2, this.y, PADDLE_WIDTH, PADDLE_THICKNESS, '#ffffff');
	}

	this.move = function() {
		this.x = mouseX;
	}
}

function Grid() {
	this.arr = [];
	this.blocks = GRID_ROWS * GRID_COLS;

	for (let row = 0; row < GRID_ROWS; ++row) {
		this.arr.push([]);
		for (let col = 0; col < GRID_COLS; ++col) {
			this.arr[row].push(getRandomInt(1,3));
		}
	}

	this.draw = function() {
		for (let row = 0; row < this.arr.length; ++row) {
			for (let col = 0; col < this.arr[row].length; ++col) {
				let color;
				switch(this.arr[row][col]) {
					case 1: color = '#0000ff'; break;
					case 2: color = '#00ff00'; break;
					case 3: color = '#ff0000'; break;
				}
				if (color) drawRect(col * BLOCK_WIDTH, row * BLOCK_HEIGHT, BLOCK_WIDTH - 1, BLOCK_HEIGHT - 1, color);
			}
		}
	}

	this.collision = function(x, y, prevx, prevy) {
		let collision = 0;
		let changevx = false;
		let changevy = false;
		let row = Math.floor(y / BLOCK_HEIGHT);
		let col = Math.floor(x / BLOCK_WIDTH);
		if (row < this.arr.length) {
			if (this.arr[row][col] > 0) {
				--this.arr[row][col];
				score += 10;

				if (this.arr[row][col] == 0) {
					--this.blocks;
					if (this.blocks == 0) {
						reset(true);
						return 0;
					}
				}

				let prevRow = Math.floor(prevy / BLOCK_HEIGHT);
				let prevCol = Math.floor(prevx / BLOCK_WIDTH);
				
				if (prevRow != row) changevy = true;
				if (prevCol != col) changevx = true;
			}
		}

		if (changevy && !changevx) collision = 1;
		else if (!changevy && changevx) collision = 2;
		else if (changevy && changevx) collision = 3;

		return collision;
	}
}

function reset(win) {
	ball = new Ball(BALL_START_X, BALL_START_Y);
	grid = new Grid();
	if (win) {
		if (ballBaseVel + 2 < PADDLE_THICKNESS) ballBaseVel += 2;
		score += 100;
	}
	else {
		addLeaderboardEntry(score);
		score = 0;
		ballBaseVel = BALL_START_BASE_VEL;
	}
}

function updateScore() {
	document.getElementById('score').innerHTML = `Punkty: ${score}`;
}

function updateMousePos(event) {
	mouseX = event.clientX - canvasRect.left;
}

function drawRect(x, y, width, height, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}