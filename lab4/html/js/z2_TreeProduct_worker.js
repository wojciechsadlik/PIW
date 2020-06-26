// https://app.codility.com/programmers/lessons/91-tasks_from_indeed_prime_2016_challenge/tree_product/
// https://app.codility.com/demo/results/training8YSJ6P-4TK/

onmessage = message => postMessage(['END', solution(message.data[0], message.data[1])]);


function solution(A,B) {
	const bridgeCount = A.length;

	let max = bridgeCount + 1;
	postMessage(['UPDATE', max]);

	let bridgesMap = generateMapOfBridges(A,B,bridgeCount);

	for (let bridge1 = 0; bridge1 < bridgeCount; ++bridge1) {
		let Anode1 = A[bridge1];
		let Bnode1 = B[bridge1];
		let AnodeBridges1 = bridgesMap.get(Anode1);
		let BnodeBridges1 = bridgesMap.get(Bnode1);
		
		if (AnodeBridges1.length != 1 && BnodeBridges1.length != 1) {
			// usun most
			AnodeBridges1.splice(AnodeBridges1.indexOf(bridge1), 1);
			BnodeBridges1.splice(BnodeBridges1.indexOf(bridge1), 1);

			let newTree1 = BFS(bridgesMap, A, B, Anode1);
			let X = newTree1.length;
			let Y = bridgeCount + 1 - X;
			let XY = X * Y;
			if (XY > max){
				max = XY;
				postMessage(['UPDATE', max]);
			}

			if (X/2 * X/2 * Y > max || X * Y/2 * Y/2 > max) {
				for (let bridge2 = bridge1 + 1; bridge2 < bridgeCount; ++bridge2) {
					let Anode2 = A[bridge2];
					let Bnode2 = B[bridge2];
					let AnodeBridges2 = bridgesMap.get(Anode2);
					let BnodeBridges2 = bridgesMap.get(Bnode2);
					
					if (AnodeBridges2.length != 1 && BnodeBridges2.length != 1) {
						let newTree1IncludesAnode = newTree1.includes(Anode2);
						if ((newTree1IncludesAnode && X/2 * X/2 * Y > max)
						|| (!newTree1IncludesAnode && X * Y/2 * Y/2 > max)) {
								// usun drugi most
								AnodeBridges2.splice(AnodeBridges2.indexOf(bridge2), 1);
								BnodeBridges2.splice(BnodeBridges2.indexOf(bridge2), 1);
								
								let newTree2 = BFS(bridgesMap, A, B, Anode2);
								let Z = newTree2.length;
								let newX = X;
								let newY = Y;
								if (newTree1IncludesAnode) {
									newX -= Z;
								} else {
									newY -= Z;
								}
			
								let XYZ = newX * newY * Z;
								if (XYZ > max){
									max = XYZ;
									postMessage(['UPDATE', max]);
								}
								// przywroc usuniety most
								AnodeBridges2.push(bridge2);
								BnodeBridges2.push(bridge2);
						}
						else
							break;
					}
				}
			}
			
			// przywroc usuniety most
			AnodeBridges1.push(bridge1);
			BnodeBridges1.push(bridge1);
		}
	}

	return max.toString();
}

function generateMapOfBridges(A,B,bridgeCount) {
	let bridgesMap = new Map();
	for (let bridge = 0; bridge < bridgeCount; ++bridge) {
		let Anode = A[bridge];
		let Bnode = B[bridge];
		if (bridgesMap.has(Anode))
			bridgesMap.get(Anode).push(bridge);
		else
			bridgesMap.set(Anode, [bridge]);

		if (bridgesMap.has(Bnode))
			bridgesMap.get(Bnode).push(bridge);
		else
			bridgesMap.set(Bnode, [bridge]);
	}

	return bridgesMap;
}

function BFS(bridgesMap, A, B, start) {
	let sourceWithBridges = new Map([[start, Array.from(bridgesMap.get(start))]]);
	let swbiterator = sourceWithBridges.entries();
	let next = swbiterator.next();
	while (!next.done) {
		let source = next.value[0];
		let bridges = next.value[1];
		while (bridges.length) {
			let bridge = bridges.shift();

			let newNode = A[bridge];
			if (newNode == source)
				newNode = B[bridge];

			sourceWithBridges.set(newNode, bridgesMap.get(newNode).filter(br => br != bridge));
		}
		next = swbiterator.next();
	}

	return Array.from(sourceWithBridges.keys());
}
