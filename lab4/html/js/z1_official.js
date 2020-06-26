function processing(time_ds) {
	postMessage(time_ds);

	if (time_ds > 0)
		setTimeout(processing, 100, time_ds - 1);
}

onmessage = (message) => {
	processing(message.data);
}