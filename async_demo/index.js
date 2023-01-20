// Promise-based approach
// getUser(1)  // Don't forget to leave the semicolon off of chains.
// 	.then(user => getRepositories(user.gitHubUsername))
// 	.then(repos => getCommits(repos[0]))
// 	.then(commits => displayCommits(commits))
// 	.catch(err => console.log('Error: ', err.message));

// Async / Await approach
async function displayCommits() {
	try {
		const user = await getUser(1);
		const repos = await getRepositories(user.gitHubUsername);
		const commits = await getCommits(repos[0]);
		console.log('Commits: ', commits);
	}
	catch (err) {
		console.log('Error: ', err.message)
	}
}
displayCommits();

// function getRepositories(user) {
// 	console.log('User: ', user);
// 	getRepositories(user.gitHubUsername, getCommits);
// }

// function getCommits(repos) {
// 	getCommits(repo, displayCommits);
// }

// function displayCommits(commits) {
// 	console.log(commits);
// }

function getUser(id) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Reading a User from the database . . .');
			resolve({ id: id, gitHubUsername: 'amneher' });
		}, 2000);
	});
}

function getRepositories(username) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Reading Repositories from the database . . .');
			resolve(['repo1', 'repo2', 'repo3']);
		}, 2000);
	});
}

function getCommits(repo) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('Reading Commits from the database . . .');
			// resolve(['commit1', 'commit2', 'commit3']);
			reject(new Error("Couldn't get the commits"));
		}, 2000)
	});
}