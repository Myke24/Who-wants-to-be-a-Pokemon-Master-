let question = document.querySelector('#question');
let totalWinnings = document.querySelector('#totalWinnings');
let potentialEarnings = document.querySelector('#potentialEarnings');
let scoringMeter = document.querySelector('#scoringMeter');
// console.log(scoringMeter.children[0].innerText.slice(1)); use this for game loop for dynamic increments
const points = [
	10,
	500,
	1000,
	2500,
	5000,
	10000,
	250000,
	500000,
	750000,
	1000000,
];

//----------Timer Stuff------------------------------------
function startTimer() {
	const seconds = setInterval(myTimer, 1000);
	let time = 9;
	const timer = document.querySelector('#timer');
	function myTimer() {
		timer.innerText = `00:0${time--}`;
		if (time < 0) {
			myStopFunction();
			console.log('timer stopped, intiate loss function');
		}
	}

	function myStopFunction() {
		clearInterval(seconds);
	}
}

/* ------------------------------ What Pokemon is this? --------------------------------*/

const question1 = async () => {
	let level = scoringMeter.children[scoringMeter.children.length - 1]; //make this dynamic
	level.style.border = 'dotted lime';
	let randomPokemonId = Math.floor(Math.random() * 100) + 1;
	question.innerText = 'What is the name of this Pokemon?';
	const pokemonSprite = document.querySelector('#pokemonSprite');
	let randomPokemon = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
	)
		.then((res) => res.json())
		.then((pokemon) => {
			return pokemon;
		});
	pokemonSprite.src = await randomPokemon.sprites.front_default;

	const answer = await randomPokemon.name;
	let wrongAnswers = [];

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

	let selectedAnswer = undefined;
	document.onclick = (e) => {
		if (e.target.classList.contains('answer')) {
			selectedAnswer = e.target.innerText;
			console.log(
				'This needs to show the user that they selected ' + selectedAnswer
			);
		} else if (e.target.id === 'finalAnswer') {
		}
	};

	const finalAnswer = document.querySelector('#finalAnswer');

	finalAnswer.onclick = () => {
		if (selectedAnswer !== undefined) {
			if (selectedAnswer === answer) {
				//This is where winning function should go---------------<-----------<------<
				console.log('Hell yeah, you FUCKIN Right!');
				potentialEarnings.innerText =
					Number(potentialEarnings.innerText) + points[0];
				level.style.background = 'lime';
				level.style.borderRadius = '10%';
			} else {
				console.log('Sorry your FUCKIN WRONG!!');
			}
		} else {
			console.log(
				'you have to choose an answer first. This button should be working right now!!'
			);
		}
	};

	startTimer();
};
question1();
