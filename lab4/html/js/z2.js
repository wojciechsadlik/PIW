function showtask(index) {
	let taskNr = index % 5;
	document.getElementById('taskNr').innerHTML = `Numer zadania = ${index} mod 5 = ${taskNr}`;
	let taskLink = '';
	switch(taskNr) {
		case 0: taskLink = 'https://app.codility.com/programmers/lessons/90-tasks_from_indeed_prime_2015_challenge/flood_depth/'; break;
		case 1: taskLink = 'https://app.codility.com/programmers/lessons/17-dynamic_programming/min_abs_sum/'; break;
		case 2: taskLink = 'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/dwarfs_rafting/'; break;
		case 3: taskLink = 'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/hilbert_maze/'; break;
		case 4: taskLink = 'https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/tree_product/'; break;
	}
	let taskLinkElement = document.getElementById('taskLink');
	taskLinkElement.href = taskLink;
	taskLinkElement.innerHTML = taskLink;
}

const INDEX = 241144;
showtask(INDEX);

let worker = new Worker('js/z2_TreeProduct_worker.js');

instanceElement = document.getElementById('instance');
resultElement = document.getElementById('result');
stateElement = document.getElementById('state');

let processing = false;
document.getElementById('start').addEventListener('click', start);

worker.onmessage = message => {
	if (message.data[0] == 'UPDATE') {
		resultElement.innerHTML = `Bieżący wynik: ${message.data[1]}`;
	} else if (message.data[0] == 'END') {
		state.innerHTML = 'Stan: Zakończono';
		resultElement.innerHTML = `Bieżący wynik: ${message.data[1]}`;
		processing = false;
	}
}

function start() {
	if (!processing) {
		let N = document.getElementById('N').value;
		if (N > 0) {
			state.innerHTML = 'Stan: Losowanie instancji';
			let AB = randomTreeGenerator(N);
			if (N < 76)
				instanceElement.innerHTML = `Wylosowana instancja:<br>A = ${AB[0]}<br>B = ${AB[1]}`;
			else
				instanceElement.innerHTML = `Wylosowana instancja:<br>Nie wypisuję instancji większych niż 75`;
			worker.postMessage(AB);
			state.innerHTML = 'Stan: Przetwarzanie';
			processing = true;
		}
	}
}

function randomTreeGenerator(N) {
	let A = [];
	let B = [];

	let nodes = [];
	for (let i = 1; i < N; ++i)
		nodes.push(i);

	let currentNode = 0;
	while(nodes.length > 0) {
		let numberOfPaths = getRandomInt(1, nodes.length % 3 + 1);
		for (let i = 0; i < numberOfPaths; ++i) {
			A.push(currentNode);
			let randomNodeIndex = getRandomInt(0, nodes.length);
			B.push(nodes[randomNodeIndex]);
			nodes.splice(randomNodeIndex, 1);
		}
		currentNode = B[getRandomInt(0, B.length)];
	}

	return [A, B];
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
