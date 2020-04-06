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

const originalAnimals = [ 'marina', 'rover', 'isabelle', 'marshal', 'klaus' ];

function randomRGB(numPairs) {
	let trial = [];
	let actualTiles = numPairs * 2;
	let tiles = numPairs / 2;
	for (let i = 0; i <= numPairs - 1; i++) {
		const r = Math.floor(Math.random() * 256);
		const g = Math.floor(Math.random() * 256);
		const b = Math.floor(Math.random() * 256);
		trial.push(`rgb(${r},${g},${b})`);
		trial.push(`rgb(${r},${g},${b})`);
	}
	let shuffledTrial = shuffle(trial);
	return shuffledTrial;
}

function numOfAnimals(numAnimalPairs) {
	console.log(numAnimalPairs);
	let trialAnimals = shuffle(originalAnimals);
	let trial = [];
	let actualTiles = numAnimalPairs * 2;
	let tiles = numAnimalPairs / 2;
	for (let i = 0; i <= numAnimalPairs - 1; i++) {
		trial.push(trialAnimals[i]);
		trial.push(trialAnimals[i]);
	}
	console.log(trial);
	shuffledAnimals = shuffle(trial);
	return shuffledAnimals;
}

function shuffle(array) {
	let counter = array.length;

	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);
let shuffledAnimals = shuffle(animalCharacters);

function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		const newDiv = document.createElement('div');
		newDiv.classList.add(color);
		newDiv.classList.add('gamePiece');

		newDiv.addEventListener('click', handleCardClick);

		gameContainer.append(newDiv);

		const startButton = document.querySelector('#start');

		startButton.classList.add('filter');

		if (matchChoice === 'Animals') {
			newDiv.classList.add('hidden');
		}
	}
}

let count = 0;
let lock = false;
let previousTarget;
let scoreTotal = 0;

function handleCardClick(event) {
	if (lock) {
		return;
	}
	if (previousTarget === event.target) {
		return;
	}
	if (event.target.classList.contains('matched')) {
		return;
	}
	if (matchChoice === 'colors') {
		event.target.classList.remove('gamePiece');
		event.target.style.backgroundColor = event.target.classList;
	} else if (matchChoice === 'Animals') {
		event.target.classList.remove('hidden');
	}
	event.target.classList.add('clicked');

	count++;
	previousTarget = event.target;
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
				lock = false;
				setTimeout(erase, 900, match);
				click.classList.remove('clicked');
			}
		} else {
			setTimeout(function() {
				for (click of clicked) {
					if (matchChoice === 'colors') {
						click.classList.add('gamePiece');
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
			if (matchChoice === 'colors') {
				createDivsForColors(randomRGB(numPairs));
				gameType = 'colors';
				let initialScore = localStorage.getItem(numPairs);
				if (initialScore === null) {
					highScore.innerText = 'Best Score: ';
				} else {
					highScore.innerText = `Best Score: ${initialScore}`;
				}
			} else {
				let numAnimalPairs = document.querySelector('#numberOfAnimals');
				let numAnimal = numAnimalPairs.value;
				console.log(numAnimal);
				createDivsForColors(numOfAnimals(numAnimal));
				let initialScore = localStorage.getItem(numAnimal);
				if (initialScore === null) {
					highScore.innerText = 'Best Score: ';
				} else {
					highScore.innerText = `Best Score: ${initialScore}`;
				}
				gameType = 'animals';
			}
		} else if (text === 'Reset') {
			reset();
		}
	});
}

function reset() {
	gameContainer.textContent = '';
	match.innerText = '';
	finish.innerText = '';
	score.innerText = 'Turns:';
	scoreTotal = 0;
	let initialScore = localStorage.getItem(numPairs);
	if (initialScore === null) {
		highScore.innerText = 'Best Score: ';
	} else {
		highScore.innerText = `Best Score: ${initialScore}`;
	}
	if (gameType === 'colors') {
		createDivsForColors(randomRGB(numPairs));
	} else if (gameType === 'animals') {
		let numAnimalPairs = document.querySelector('#numberOfAnimals');
		let numAnimal = numAnimalPairs.value;
		createDivsForColors(numOfAnimals(numAnimal));
	}
}

function erase(element) {
	element.innerText = '';
}

function endGame(scoreTotal) {
	finish.classList.remove('filter');

	let testScore = localStorage.getItem(numPairs);
	if (testScore === null || testScore === '') {
		localStorage.setItem(numPairs, scoreTotal);
	}
	if (scoreTotal < localStorage.getItem(numPairs)) {
		//localStorage.clear();
		localStorage.setItem(numPairs, scoreTotal);
		highScore.innerText = `Best Score: ${scoreTotal} `;
	}
}

function isGameOver(scoreTotal) {
	for (let div of gameContainer.children) {
		if (!div.classList.contains('matched')) {
			return;
		}
	}
	endGame(scoreTotal);
}

const number = document.querySelector('#numberOfPairs');
const choice = document.querySelector('#choice');
const form = document.querySelector('#form');
makeButton('Start Game');
makeButton('Reset');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');

choice.addEventListener('click', function() {
	if (choice.value === 'Animals') {
		console.log('animals selected');
		number.classList.add('filter');
		newSelect = document.createElement('select');
		newSelect.id = 'numberOfAnimals';
		newSelect.name = 'number';
		form.appendChild(newSelect);
		for (let i = 0; i <= 5; i++) {
			option = document.createElement('option');
			option.value = i;
			option.innerText = i;
			newSelect.appendChild(option);
		}
	}
});

document.addEventListener('DOMContentLoaded', function() {
	resetButton.classList.add('filter');
});

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
highScore.classList.add('filter');
h1.appendChild(highScore);
let finish = document.createElement('div');
finish.innerText = 'Congrats! Try again?';
finish.classList.add('finish');
finish.classList.add('filter');
document.body.appendChild(finish);
let gameType = '';
