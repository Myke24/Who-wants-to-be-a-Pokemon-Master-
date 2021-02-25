const user = {
	earnings: 0,
	currentLevel: 0,
};
let scoreArea = document.querySelector('#currentNpotentialScoreArea');
let questionNAnswerArea = document.querySelector('#questionNAnswerArea');
let scoringSection = document.querySelector('#scoringSection');
let potentialEarnings = document.querySelector('#potentialEarnings');
let scoringMeter = document.querySelector('#scoringMeter');
let meterClassList = scoringMeter.classList;
console.log(scoringMeter.children[0].innerText);

let numOfPokemon = 100;
const changeLvl = (lvl) => {
	switch (lvl) {
		case 1:
			numOfPokemon = 100;
			// for (let i = 0; i < scoringMeter.children.length; i++) {
			// 	scoringMeter.children[i].innerText =
			// 		Number(scoringMeter.children[i].innerText) * 1;
			// }
			break;
		case 2:
			numOfPokemon = 400;
			// for (let i = 0; i < scoringMeter.children.length; i++) {
			// 	scoringMeter.children[i].innerText =
			// 		Number(scoringMeter.children[i].innerText) * 2;
			// }
			break;
		case 3:
			numOfPokemon = 700;
			// for (let i = 0; i < scoringMeter.children.length; i++) {
			// 	scoringMeter.children[i].innerText =
			// 		Number(scoringMeter.children[i].innerText) * 4;
			// }
			break;
	}
};

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
	document.body.style.display = null;
	document.body.style.flexDirection = null;
	document.body.style.justifyContent = null;
	document.body.style.background = 'white';
	document.body.append(scoreArea);
	document.body.append(questionNAnswerArea);
	document.body.append(scoringSection);
	potentialEarnings.innerText = 0;
	let levels = scoringMeter.childNodes;
	levels.forEach((lvl) => {
		lvl.style = '';
	});
};

//--------------------Winning Algor-----------------------------
function winIt() {
	document.body.style.background = 'black';

	document.body.innerHTML = `
		    <div id="modal" style="">
				<p style="margin: 25%;position: absolute;left: 1%;bottom: 60%;" >CONGRATS! YOU WON!!</p>
                <button onclick='startOver()' style="margin: 25%;background: white;padding: 15%;border: 3px solid black;border-radius: 50%;text-align: center;text-decoration: none;font-size:16px;">Play Again?</button>
            </div>
	`;
}

//--------------------Losing Algor----------------------------------

let losses;

function loseIt() {
	let takeAwayFactor = () => {
		if (Number(potentialEarnings.innerText) >= 250000) {
			return 10000;
		} else if (Number(potentialEarnings.innerText) >= 10000) {
			return 1000;
		} else if (Number(potentialEarnings.innerText) > 1000) {
			return 500;
		} else if (Number(potentialEarnings.innerText) < 1000) {
			return 200;
		} else {
			return 1;
		}
	};
	potentialEarnings.innerText =
		Number(potentialEarnings.innerText) - takeAwayFactor();
	if (Number(potentialEarnings.innerText) < 50) {
		potentialEarnings.innerText = 0;
		clearInterval(losses);
		setTimeout(() => {
			document.body.innerHTML = `
			<h1 class="lostClass">Sorry you are not ready to be a Pokemon Master</h1>
			<img class="lostClass" src="https://media1.tenor.com/images/01b11fc630fccfe82dad009ea1e25c28/tenor.gif?itemid=16743813"/>
			<button id="startOverBtn" class="lostClass" onclick="startOver()">Play Again</button>
			`;
			document.body.style.display = 'flex';
			document.body.style.flexDirection = 'column';
			document.body.style.justifyContent = 'space-around';
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
	let randomPokemonId = Math.floor(Math.random() * numOfPokemon) + 1;
	let randomPokemon;
	try {
		randomPokemon = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
		)
			.then((res) => res.json())
			.then((pokemon) => {
				return pokemon;
			});
	} catch (err) {
		randomPokemon = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
		)
			.then((res) => res.json())
			.then((pokemon) => {
				return pokemon;
			});
	}

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
		return createUniqueWrong(Math.floor(Math.random() * numOfPokemon) + 1);
	};

	//Fill wrong answers array with random unique numbers
	for (let i = 0; i < 3; i++) {
		let randomID = Math.floor(Math.random() * numOfPokemon) + 1;
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
		startTimer();
	};
	await createWrongAnswers();
}

/* ------------------------------ What Pokemon is this? --------------------------------*/

const question1 = async () => {
	await getPokemonData();

	let selectedAnswer = undefined;
	document.onclick = (e) => {
		if (e.target.classList.contains('answer')) {
			answers.forEach((ans) => {
				ans.style.background = 'white';
			});
			selectedAnswer = e.target.innerText;
			e.target.style.background = 'green';
		} else if (e.target.id === 'submitAnswer') {
		}
	};

	submitAnswer.onclick = () => {
		answers.forEach((ans) => {
			ans.style.background = 'white';
		});
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
