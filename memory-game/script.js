const gameContainer = document.getElementById('game');

const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

const animalCharacters = [
	'marina',
	'rover',
	'isabelle',
	'marshal',
	'klaus',
	'marina',
	'rover',
	'isabelle',
	'marshal',
	'klaus'
];
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);
let shuffledAnimals = shuffle(animalCharacters);
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');
		//console.log(matchChoice);
		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);

		const startButton = document.querySelector('#start');

		startButton.classList.add('filter');

		if (matchChoice === 'Animals') {
			//console.log('made it in');
			newDiv.classList.add('hidden');
		}
	}
}

let count = 0;
let lock = false;
let previousTarget;
let scoreTotal = 0;
//let start = false;
// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked
	if (lock) {
		return;
	}
	if (previousTarget === event.target) {
		return;
	}
	if (event.target.classList.contains('matched')) {
		return;
	}
	//if (start === false) {
	//	return;
	//}
	//console.log('you just clicked', event.target);
	//console.log(start);
	if (matchChoice === 'colors') {
		event.target.style.backgroundColor = event.target.classList;
	} else if (matchChoice === 'Animals') {
		event.target.classList.remove('hidden');
	}
	event.target.classList.add('clicked');
	count++;
	previousTarget = event.target;
	//console.log(count);
	if (count >= '2') {
		count = 0;
		lock = true;
		scoreTotal++;
		score.innerText = `Turns: ${scoreTotal}`;
		let clicked = document.querySelectorAll('.clicked');
		if (clicked[0].classList[0] === clicked[1].classList[0]) {
			for (click of clicked) {
				click.classList.add('matched');
				match.innerText = 'Match!';
				setTimeout(erase, 900, match);
				click.classList.remove('clicked');
				lock = false;
			}
		} else {
			setTimeout(function() {
				for (click of clicked) {
					if (matchChoice === 'colors') {
						click.style.backgroundColor = 'white';
					} else {
						click.classList.add('hidden');
					}
					click.classList.remove('clicked');
					lock = false;
				}
			}, 1000);
		}
	}
	isGameOver(scoreTotal);
}

function makeButton(text) {
	const button = document.createElement('button');
	button.innerText = text;
	if (text === 'Start Game') {
		button.id = 'start';
	} else if (text === 'Reset') {
		button.id = 'reset';
	}
	document.body.appendChild(button);
	button.addEventListener('click', function() {
		if (text === 'Start Game') {
			resetButton.classList.remove('filter');
			score.classList.remove('filter');
			highScore.classList.remove('filter');
			form.classList.add('filter');
			numPairs = number.value;
			matchChoice = choice.value;
			//console.log(matchChoice);
			if (matchChoice === 'colors') {
				createDivsForColors(shuffledColors);
			} else {
				createDivsForColors(shuffledAnimals);
			}
		} else if (text === 'Reset') {
			reset();
		}
	});
}

function reset() {
	//console.log(gameContainer.children);
	gameContainer.textContent = '';
	match.innerText = '';
	finish.innerText = '';
	score.innerText = 'Turns:';
	scoreTotal = 0;
	shuffledColors = shuffle(COLORS);
	createDivsForColors(shuffledColors);
}

function erase(element) {
	element.innerText = '';
}

function endGame(scoreTotal) {
	//console.log('running endgame');
	//let finish = document.createElement('div');
	//finish.innerText = 'Congrats! Try again?';
	//finish.classList.add('finish');
	//document.body.appendChild(finish);
	finish.classList.remove('filter');
	let finalScore = localStorage.getItem('bestScore');
	///console.log('try');
	if (finalScore === null || finalScore === '') {
		localStorage.setItem('bestScore', scoreTotal);
		//console.log('catch');
	}

	if (scoreTotal < localStorage.getItem('bestScore')) {
		localStorage.clear();
		localStorage.setItem('bestScore', scoreTotal);
		highScore.innerText = highScore.innerText = `Best Score: ${scoreTotal} `;
		//console.log('adjust score');
	}
}

function isGameOver(scoreTotal) {
	//console.log(gameContainer.children);
	for (let div of gameContainer.children) {
		if (!div.classList.contains('matched')) {
			//console.log('still more to go');
			return;
		}
	}
	//console.log('at this poiint');
	endGame(scoreTotal);
}

// when the DOM loads
//createDivsForColors(shuffledColors);

const number = document.querySelector('#numberOfPairs');
const choice = document.querySelector('#choice');
const form = document.querySelector('#form');
makeButton('Start Game');
makeButton('Reset');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');

document.addEventListener('DOMContentLoaded', function() {
	resetButton.classList.add('filter');
});

let initialScore = localStorage.getItem('bestScore');
if (initialScore === null) {
	localStorage.clear();
	localStorage.setItem('bestScore', '');
}
const h1 = document.querySelector('h1');
let score = document.createElement('div');
score.id = 'score';
score.innerText = 'Turns: ';
score.classList.add('filter');
h1.appendChild(score);
let match = document.createElement('span');
match.id = 'match';
h1.appendChild(match);
const highScore = document.createElement('div');
highScore.id = 'highScore';
highScore.innerText = `Best Score: ${initialScore} `;
highScore.classList.add('filter');
h1.appendChild(highScore);
let finish = document.createElement('div');
finish.innerText = 'Congrats! Try again?';
finish.classList.add('finish');
finish.classList.add('filter');
document.body.appendChild(finish);
