const user = {
	earnings: 0,
	currentLevel: 0,
};
document.querySelector('#modal').style.display = 'none';
let scoreArea = document.querySelector('#currentNpotentialScoreArea');
let questionNAnswerArea = document.querySelector('#questionNAnswerArea');
let scoringSection = document.querySelector('#scoringSection');
let potentialEarnings = document.querySelector('#potentialEarnings');
let scoringMeter = document.querySelector('#scoringMeter');
let meterClassList = scoringMeter.classList;

let question = document.querySelector('#question');

const submitAnswer = document.querySelector('#submitAnswer');
let submittedAnswer = false;
let answer = undefined;
let wrongAnswers;
document.querySelector('#helper').style.display = 'none';
scoringMeter.children[
	scoringMeter.children.length - user.currentLevel - 1
].style.border = 'dotted lime';
question.innerText = 'What is the name of this Pokemon?';
const pokemonSprite = document.querySelector('#pokemonSprite');
let answers = document.querySelectorAll('.answer');
const startOverBtn = document.querySelector('#startOverBtn');

const startOver = async () => {
	user.earnings = 0;
	user.currentLevel = 0;
	question1();
	document.body.innerHTML = ' ';
	document.body.append(scoreArea);
	document.body.append(questionNAnswerArea);
	document.body.append(scoringSection);
	potentialEarnings.innerText = 0;
	let levels = scoringMeter.childNodes;
	console.log(levels[0]);
	levels.forEach((lvl) => {
		lvl.style = '';
	});
};

//--------------------Winning Algor-----------------------------
function winIt() {
	console.log('Congrads, you WON!... Nothing!');
	document.querySelector('#modal').style.display = 'flex';
}

//--------------------Losing Algor----------------------------------

let losses;

function loseIt() {
	let takeAwayFactor = () => {
		if (Number(potentialEarnings.innerText) >= 100000) {
			return 10000;
		} else if (
			Number(potentialEarnings.innerText) < 100000 &&
			Number(potentialEarnings.innerText) >= 10000
		) {
			return 1000;
		} else if (
			Number(potentialEarnings.innerText) <= 10000 &&
			Number(potentialEarnings.innerText) >= 5000
		) {
			return 100;
		} else if (Number(potentialEarnings.innerText < 1000)) {
			return 25;
		} else {
			return 10;
		}
	};
	potentialEarnings.innerText =
		Number(potentialEarnings.innerText) - takeAwayFactor();
	if (Number(potentialEarnings.innerText) < 0) {
		clearInterval(losses);
		setTimeout(() => {
			document.body.innerHTML = `
			<h1>Sorry you are not ready to be a Pokemon Master</h1>
			<img src="https://media1.tenor.com/images/01b11fc630fccfe82dad009ea1e25c28/tenor.gif?itemid=16743813"/>
			<button id="startOverBtn" onclick="startOver()">Play Again</button>
			`;
			// document.querySelector('#startOverBtn').style.display = 'block';
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

/*--------------------------------Get data and create answer, wrong answers and question for that random pokemon*/
async function getPokemonData() {
	let randomPokemonId = Math.floor(Math.random() * 100) + 1;
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

	const createWrongAnswers = async () => {
		answers[rand4[0]].innerText = wrongAnswers[0];
		answers[rand4[1]].innerText = wrongAnswers[1];
		answers[rand4[2]].innerText = wrongAnswers[2];
		answers[rand4[3]].innerText = answer;
		// startTimer();
	};
	await createWrongAnswers();
}

/* ------------------------------ What Pokemon is this? --------------------------------*/

const question1 = async () => {
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
			}
			if (selectedAnswer === answer) {
				//This is where winning function should go---------------<-----------<------<
				if (user.currentLevel === 9) {
					stopTimer();
					winIt();
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
				console.log(scoringMeter.children.length - user.currentLevel - 1);
				if (scoringMeter.children.length - user.currentLevel - 1 !== -1) {
					scoringMeter.children[
						scoringMeter.children.length - user.currentLevel - 1
					].style.border = 'dotted lime';
					question1();
				}
			} else {
				stopTimer();
				loseEarnings();
			}
		} else {
			document.querySelector('#helper').style.display = 'block';
			setTimeout(helperClear, 5000);
			function helperClear() {
				document.querySelector('#helper').style.display = 'none';
			}
		}
	};
};
question1();
