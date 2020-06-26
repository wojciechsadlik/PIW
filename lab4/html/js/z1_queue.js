class Queue {
	constructor(maxLength) {
		this.maxLength = maxLength;
		this.array = [];
	}

	push = (element) => {
		let accepted = false;

		if (this.array.length + 1 <= this.maxLength) {
			this.array.push(element);
			accepted = true;
		}

		return accepted;
	}

	pop = () => { return this.array.shift(); }

	join = () => { 
		let string = '';
		for (let element of this.array) {
			string += JSON.stringify(element);
		}

		return string;
	}

	setMaxLength = (maxLength) => {
		this.maxLength = maxLength;
		
		if (maxLength < this.array.length) {
			this.array = this.array.slice(0, maxLength);
		}
	}
}

const MAX_QUEUE_LENGTH = 3;

let queue = new Queue(MAX_QUEUE_LENGTH);

onmessage = function(message) {
	if (message.data[0] == 'PUSH') {
		let accepted = queue.push(message.data[1]);
		postMessage(['PUSH', accepted]);
	} else if (message.data[0] == 'POP') {
		let element = queue.pop();
		postMessage(['POP', element]);
	} else if (message.data[0] == 'PRINT') {
		let string = queue.join();
		postMessage(['PRINT', string]);
	} else if (message.data[0] == 'SET_LENGTH') {
		queue.setMaxLength(message.data[1]);
	}
}