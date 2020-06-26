let editor = document.getElementById('editor');
let editorRect = editor.getBoundingClientRect();
let menu = document.getElementById('menu');
let menuRect = menu.getBoundingClientRect();
let shapeSelector = document.getElementById('shape');
let colorSelector = document.getElementById('color');
let filledSelector = document.getElementById('filled');
let brushSelector = document.getElementById('brush');
let brushSizeSelector = document.getElementById('brushSize');
let clear = document.getElementById('clear');
clear.addEventListener('click', () => {ctx.clearRect(0, 0, canvas.width, canvas.height);})

let canvas = document.getElementById('canvas');
canvas.width = editorRect.width - menuRect.width - 10;
canvas.height = editorRect.height - 10;
let canvasRect = canvas.getBoundingClientRect();
let ctx = canvas.getContext('2d');


let dragging = false;
let x, y;
let dx, dy;
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', () => {dragging = false;});

let cvSaveData;
function drag(event) {
	if (dragging) {
		if (brushSelector.checked) {
			size = brushSizeSelector.value;
			x = event.clientX - canvasRect.left;
			y = event.clientY - canvasRect.top;
			draw(x - size / 2, y - size / 2, size, size);
		}
		else {
			dx = event.clientX - canvasRect.left - x;
			dy = event.clientY - canvasRect.top - y;
	
			ctx.putImageData(cvSaveData, 0, 0);
			draw(x, y, dx, dy);
		}
	}
}

function mousedown(event) {
	dragging = true;
	x = event.clientX - canvasRect.left;
	y = event.clientY - canvasRect.top;
	dx = 0;
	dy = 0;

	if (brushSelector.checked) {
		let size = brushSizeSelector.value;
		draw(x - size / 2, y - size / 2, size, size);
	} else {
		cvSaveData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
}

function draw(x, y, dx, dy) {
	let shape = shapeSelector.value;
	let color = colorSelector.value;
	let filled = filledSelector.checked;
	if (shape == 'rect') {
		drawRect(x, y, dx, dy, color, filled);
	} else if (shape == 'circle') {
		let r = Math.sqrt(dx * dx + dy * dy) / 2;
		drawCircle(x + dx / 2, y + dy / 2, r, color, filled);
	}
}

function drawRect(x, y, width, height, color, filled) {
	if (filled)	{
		ctx.fillStyle = color;
		ctx.fillRect(x, y, width, height);
	}
	else {
		ctx.strokeStyle = color;
		ctx.strokeRect(x, y, width, height);
	}
}

function drawCircle(x, y, r, color, filled) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	if (filled) {
		ctx.fillStyle = color;
		ctx.fill();
	}
	else {
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}