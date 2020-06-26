const MAX_LEADERBOARD_LENGTH = 5;

let nick = '';
let minScore = 10;

let acceptNick = document.getElementById('acceptNick');
acceptNick.addEventListener('click', () => { 
							nick = document.getElementById('nick').value; });

let leaderboardTableElement = document.getElementById('leaderboard');

let leaderboard = [];

updateLeaderboardTable();

function updateLeaderboardTable() {
	let htmlStr = '<tr><th>Nick</th><th>Wynik</th></tr>';
	
	leaderboard.forEach(entry => htmlStr += entry.toTableElement());

	leaderboardTableElement.innerHTML = htmlStr;
}

function addLeaderboardEntry(score) {
	if (score >= minScore || leaderboard.length < MAX_LEADERBOARD_LENGTH && score > 0) {
		let i = 0;
		while (i < leaderboard.length) {
			if (leaderboard[i].score < score) break;
			i++;
		}

		leaderboard.splice(i, 0, new leaderboardEntry(nick, score));

		if (leaderboard.length > MAX_LEADERBOARD_LENGTH) 
			leaderboard.pop();

		minScore = leaderboard[leaderboard.length - 1].score;

		updateLeaderboardTable();
	}
}

function leaderboardEntry(nick, score) {
	this.nick = nick;
	this.score = score;

	this.toTableElement = function() {
		return `<tr><td>${this.nick}</td><td>${this.score}</td></tr>`;
	}
}