// fetch(
// 	'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png'
// )
// 	.then((res) => res.json())
// 	.then((data) => {

//     });
let question = document.querySelector('#question');

/* ------------------------------ What Pokemon is this? --------------------------------*/

const question1 = async () => {
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

	//Randomize answer order
	const rand = Math.floor(Math.random() * 4);
	let rand4 = [0, 1, 2, 3];
	let item = rand4.pop();
	let item2 = rand4.shift();
	rand4.splice(rand, 0, item);
	rand4.splice(rand, 0, item2);

	for (let i = 0; i < 3; i++) {
		await fetch(
			`https://pokeapi.co/api/v2/pokemon/${Math.floor(Math.random() * 100) + 1}`
		)
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

	//----------Timer Stuff----------------------
	const seconds = setInterval(myTimer, 1000);
	let time = 9;
	const timer = document.querySelector('#timer');
	function myTimer() {
		timer.innerText = `00:0${time--}`;
		if (time < 0) {
			myStopFunction();
		}
	}

	function myStopFunction() {
		clearInterval(seconds);
	}
};
question1();

// let img = document.createElement('img');
// img.src =
// 	'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png';
// body.appendChild(img);
