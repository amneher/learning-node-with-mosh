// const p = new Promise((resolve, reject) => {
// 	// some async work . . .
// 	setTimeout(() => {
// 		console.log('Reading a User from the database . . .');
// 		resolve({ gitHubUsername: 'amneher' });
// 		reject(new Error('Oops!'));
// 	}, 2000);
// 	// reject(new Error('message'));
// });

// p
// 	.then(result => console.log('Result: ', result))
// 	.catch(err => console.log('Error: ', err));

const p1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('Async operation 1 . . .');
		resolve(1);
		// reject(new Error('Oops!'));
	}, 2000);
});

const p2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		console.log('Async operation 2 . . .');
		resolve(2);
		// reject(new Error('Oops!'));
	}, 2000);
});

Promise.all([p1, p2])  // Or, use .race to get the first one that finishes.
	.then(result => console.log(result))
	.catch(err => console.log(err.message));