const user = {
	earnings: 0,
	currentLevel: 0,
};
let question = document.querySelector('#question');
let totalWinnings = document.querySelector('#totalWinnings');
let potentialEarnings = document.querySelector('#potentialEarnings');
let scoringMeter = document.querySelector('#scoringMeter');
const submitAnswer = document.querySelector('#submitAnswer');
let submittedAnswer = false;
let answer = undefined;
let wrongAnswers;
document.querySelector('#helper').style.display = 'none';

const startOver = () => {
	user.earnings = 0;
	user.currentLevel = 0;
	question1();
};

//--------------------Losing Algor----------------------------------

let losses;

function loseIt() {
	let takeAwayFactor = () => {
		if (Number(potentialEarnings.innerText) >= 250000) {
			return 10000;
		} else if (Number(potentialEarnings.innerText) >= 1000) {
			return 100;
		} else {
			return 50;
		}
	};
	potentialEarnings.innerText =
		Number(potentialEarnings.innerText) - takeAwayFactor();
	if (Number(potentialEarnings.innerText) <= 0) {
		clearInterval(losses);
		setTimeout(() => {
			document.body.innerHTML = `
			<h1>Sorry you are not ready to be a Pokemon Master</h1>
			<img src="https://media1.tenor.com/images/01b11fc630fccfe82dad009ea1e25c28/tenor.gif?itemid=16743813"/>
			<button onclick="startOver()">Play Again?</button>`;
		}, 1000);
	}
}
const loseEarnings = () => {
	losses = setInterval(loseIt, 20);
};

//----------Timer Stuff------------------------------------

let time = 9;
const timer = document.querySelector('#timer');
const countdown = () => {
	timer.innerText = `00:0${time--}`;
	if (time <= -1) {
		stopTimer();
		loseEarnings();
	}
};
let setTimer;

const startTimer = () => {
	setTimer = setInterval(countdown, 1000);
};
function stopTimer() {
	clearInterval(setTimer);
	time = 10;
	timer.innerText = `00:${time--}`;
}

/* ------------------------------ What Pokemon is this? --------------------------------*/

const question1 = async () => {
	scoringMeter.children[
		scoringMeter.children.length - user.currentLevel - 1
	].style.border = 'dotted lime';
	let randomPokemonId = Math.floor(Math.random() * 100) + 1;
	question.innerText = 'What is the name of this Pokemon?';
	const pokemonSprite = document.querySelector('#pokemonSprite');

	async function getPokemonData() {
		let randomPokemon = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
		)
			.then((res) => res.json())
			.then((pokemon) => {
				return pokemon;
			});
		pokemonSprite.src = await randomPokemon.sprites.front_default;

		answer = await randomPokemon.name;
		wrongAnswers = [];

		//Randomize the order of the answers
		const rand = Math.floor(Math.random() * 4);
		let rand4 = [0, 1, 2, 3];
		let item = rand4.pop();
		let item2 = rand4.shift();
		rand4.splice(rand, 0, item);
		rand4.splice(rand, 0, item2);

		//Create an array of unique random numbers for random pokemon ids to fetch for the wrong numbers array
		let uniqueRanNumsArr = [];
		const createUniqueWrong = (randNum) => {
			if (!uniqueRanNumsArr.includes(randNum) && randNum !== randomPokemonId) {
				return randNum;
			}
			return createUniqueWrong(Math.floor(Math.random() * 100) + 1);
		};

		//Fill wrong answers array with random unique numbers
		for (let i = 0; i < 3; i++) {
			let randomID = Math.floor(Math.random() * 100) + 1;
			uniqueRanNumsArr.push(createUniqueWrong(randomID));
			await fetch(`https://pokeapi.co/api/v2/pokemon/${uniqueRanNumsArr[i]}`)
				.then((res) => res.json())
				.then((pokemon) => {
					wrongAnswers.push(pokemon.name);
				});
		}

		let answers = document.querySelectorAll('.answer');

		answers[rand4[0]].innerText = wrongAnswers[0];
		answers[rand4[1]].innerText = wrongAnswers[1];
		answers[rand4[2]].innerText = wrongAnswers[2];
		answers[rand4[3]].innerText = answer;
		console.log(answer);
		startTimer();
	}

	await getPokemonData();

	let selectedAnswer = undefined;
	document.onclick = (e) => {
		if (e.target.classList.contains('answer')) {
			selectedAnswer = e.target.innerText;
			console.log(
				'This needs to show the user that they selected ' + selectedAnswer
			);
		} else if (e.target.id === 'submitAnswer') {
		}
	};

	submitAnswer.onclick = () => {
		if (selectedAnswer !== undefined) {
			if (true) {
				stopTimer();
				console.log('Stopped timer');
			}
			if (selectedAnswer === answer) {
				//This is where winning function should go---------------<-----------<------<
				if (user.currentLevel === 9) {
					console.log('Congraduates, you WON!... Nothing!');
				}
				user.currentLevel++;
				potentialEarnings.innerText =
					Number(potentialEarnings.innerText) +
					Number(
						scoringMeter.children[
							scoringMeter.children.length - user.currentLevel
						].innerText
					);
				for (let child = 0; child < user.currentLevel; child++) {
					scoringMeter.children[
						scoringMeter.children.length - user.currentLevel
					].style.background = 'lime';
					scoringMeter.children[
						scoringMeter.children.length - user.currentLevel
					].style.borderRadius = '10%';
				}
				scoringMeter.children[
					scoringMeter.children.length - user.currentLevel - 1
				].style.border = 'dotted lime';
				question1();
			} else {
				stopTimer();
				loseEarnings();
			}
		} else {
			document.querySelector('#helper').style.display = 'block';
		}
	};
};
question1();
