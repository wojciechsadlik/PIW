class Office {
	constructor(id, htmlElement) {
		this.id = id;
		this.busy = false;
		this.worker = new Worker('js/z1_official.js');
		this.htmlElement = htmlElement;

		this.worker.onmessage = (message) => {
			if (message.data > 0)
				this.updateState(message.data);
			else {
				this.setBusy(false);
				if (!stop) {
					++servedCount;
					servedCountElement.innerHTML = `Obsłużonych: ${servedCount}`;
				}
			}
		}
	}

	setBusy = (busy, time = 0) => {
		this.busy = busy;
		this.updateState(time);
	}

	send = (client) => {
		this.setBusy(true, client.time_ds);
		this.worker.postMessage(client.time_ds);
	}

	updateState = (time = 0) => {
		if (!this.busy)
			this.htmlElement.innerHTML = `${this.id}: wolny`;
		else
			this.htmlElement.innerHTML = `${this.id}: zajęty ${time}`;
	}
}

let A = new Office('A', document.getElementById('Astate'));
let B = new Office('B', document.getElementById('Bstate'));
let C = new Office('C', document.getElementById('Cstate'));

let queue = new Worker('js/z1_queue.js');

let clientGenerator = new Worker('js/z1_clientGenerator.js');

let rejectedCount = 0;
let rejectedCountElement = document.getElementById('rejectedCount');
let servedCount = 0;
let servedCountElement = document.getElementById('servedCount');
let stop = true;

let queueElement = document.getElementById('queue');

queue.onmessage = function(message) {
	if (message.data[0] == 'PUSH') {
		if (!message.data[1]) {
			++rejectedCount;
			rejectedCountElement.innerHTML = `Odrzuconych: ${rejectedCount}`;
		}
	} else if (message.data[0] == 'POP') {
		if (typeof message.data[1] != 'undefined') {
			sendClient(message.data[1]);
		}
	} else if (message.data[0] == 'PRINT') {
		queueElement.innerHTML = `Kolejka: ${message.data[1]}`;
	}
}

clientGenerator.onmessage = function(message) {
	queue.postMessage(['PUSH', message.data]);
}

function sendClient(client) {
	let posted = false;

	if (!A.busy) {
		A.send(client);
		posted = true;
	} else if (!B.busy) {
		B.send(client);
		posted = true;
	} else if (!C.busy) {
		C.send(client);
		posted = true;
	}

	if (!posted) {
		setTimeout(sendClient, 100, client);
	}
}

function requestNextClient() {
	if (!(A.busy && B.busy && C.busy))
		queue.postMessage(['POP']);

	queue.postMessage(['PRINT']);

	setTimeout(requestNextClient, 100);
}

function set() {
	stop = false;

	let queueLength = document.getElementById('queueLength').value;
	queue.postMessage(['SET_LENGTH', queueLength]);

	let processingTimeM = Number(document.getElementById('processingTimeM').value);
	let processingTimeV = Number(document.getElementById('processingTimeV').value);
	let clientRate = Number(document.getElementById('clientRate').value);
	clientGenerator.postMessage(['SET', processingTimeM, processingTimeV, clientRate]);
	clientGenerator.postMessage(['START', processingTimeM, processingTimeV, clientRate]);
}

function reset() {
	stop = true;

	clientGenerator.postMessage(['STOP']);

	queue.postMessage(['SET_LENGTH', 0]);

	rejectedCount = 0;
	rejectedCountElement.innerHTML = `Odrzuconych: ${rejectedCount}`;

	servedCount = 0;
	servedCountElement.innerHTML = `Obsłużonych: ${servedCount}`;
}

document.getElementById('set').addEventListener('click', set);
document.getElementById('reset').addEventListener('click', reset);

requestNextClient();