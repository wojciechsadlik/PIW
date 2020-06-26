class Client {
	constructor(time_ds) {
		this.time_ds = time_ds;
	}
}

function gaussianRandom_box_muller(mean, deviation) {
	let u1 = Math.random();
	let u2 = Math.random();
	let a = Math.sqrt(-2 * Math.log(u1));
	let b = 2 * Math.PI * u2;
	let z1 = a * Math.sin(b) * deviation + mean;
	let z2 = a * Math.cos(b) * deviation + mean;
	return [z1, z2];
}

function exponentialRandom(rate) {
	return Math.log(1 - Math.random()) / -rate;
}

let working = false;
let randomGaussianNrs = [];
let processingTimeM = 40;
let processingTimeV = 20;
let processingTimeDev = Math.sqrt(processingTimeV);
let clientsRate = 20;


function postNextClient() {
	if (working) {
		let posted = false;
		while (!posted) {
			if (randomGaussianNrs.length > 0) {
				let time = Math.floor(randomGaussianNrs.pop());
				if (time > 0) {
					postMessage(new Client(time));
					posted = true;
				}
			} else {
				randomGaussianNrs = gaussianRandom_box_muller(processingTimeM, processingTimeDev);
			}
		}

		setTimeout(postNextClient, 1000 * exponentialRandom(clientsRate));
	}
}

onmessage = (message) => {
	if (message.data[0] == 'START' && !working) {
		working = true;
		postNextClient();
	} else if (message.data[0] == 'SET') {
		processingTimeM = message.data[1];
		processingTimeV = message.data[2];
		processingTimeDev = Math.sqrt(processingTimeV);
		clientsRate = message.data[3];
	} else if (message.data[0] == 'STOP') {
		working = false;
	}
}