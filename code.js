const EMPTY = '.';
const VALID = true;

function restartGame()
{
        Gameboard.newGame();
	player1.resetScore();
	player2.resetScore();
	tie.resetScore();
}


const Gameboard = (function () {
	let board = [
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
	];

	let turn = 'X';
	let winner = EMPTY;
	let winnerMoveDisplayed = false;
	let gridMarked = 0;

	const setTurn = () => turn = (turn != 'X') ? 'X' : 'O';
	const getTurn = () => turn;
	const getWinner = () => winner;
	const updateGridMarked = () => gridMarked++;
	const newGame = () => {
		winner = EMPTY;
		board = [
			[EMPTY, EMPTY, EMPTY],
                	[EMPTY, EMPTY, EMPTY],
                	[EMPTY, EMPTY, EMPTY],
		];
		gridMarked = 0;
		winnerMoveDisplayed = false;
		Array.from(document.querySelectorAll('.grid')).forEach(grid => {
			grid.textContent = '';
			grid.style.color = 'white';
		});
	};


	function play(e) {
		let gridIndex = e.currentTarget.id.split('-')[1];
		
		if (board[Math.floor(gridIndex / 3)][gridIndex % 3] == EMPTY)
		{
			board[Math.floor(gridIndex / 3)][gridIndex % 3] = getTurn();
			e.currentTarget.textContent = getTurn();
			setTurn();
			updateGridMarked();
		}
		
		if (isGameOver() && winnerMoveDisplayed)
		{
			console.log(getWinner());
			switch(getWinner())
			{
				case 'X':
					player1.updateScore();
					break;
				case 'O':
					player2.updateScore();
					break;
				default:
					tie.updateScore();
					break;
			}
			newGame();
		}

		if (isGameOver() && !winnerMoveDisplayed)
			winnerMoveDisplayed = true;
	}

	function isGameOver()
	{
		let i = 0, j = 0;
		for (i = 0; i < 3; i++)
		{
			if(board[i][0] != EMPTY && board[i][0] == board[i][1] && board[i][1] == board[i][2])
			{
				winner = board[i][0];
				for (j = 0; j < 3; j++)
					document.querySelector(`#grid-${i * 3 + j}`).style.color = 'orange';
				return true;
			}
		}

		for (i = 0; i < 3; i++)
		{
			if (board[0][i] != EMPTY && board[0][i] == board[1][i] && board[1][i] == board[2][i])
			{
				winner = board[0][i];
				for (j = 0; j < 3; j++)
					document.querySelector(`#grid-${j * 3 + i}`).style.color = 'orange';
				return true;
			}
		}

		if (board[0][0] != EMPTY && board[0][0] == board[1][1] && board[1][1] == board[2][2]
			|| (board[0][2] != EMPTY && board[0][2] == board[1][1] && board[1][1] == board[2][0]))
		{
			winner = board[1][1];

			if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
				for (j = 0; j < 3; j++)
					document.querySelector(`#grid-${j * 4}`).style.color = 'orange';
			else
				for (j = 0; j < 3; j++)
					document.querySelector(`#grid-${j * 2 + 2}`).style.color = 'orange';

			return true;
		}

		if (gridMarked == 9)
			return true;
		
		return false;
	}

	return { play, isGameOver, newGame }

})();

const createPlayer =  (function () {
	let name;
	let marker = EMPTY;
	let score = 0;

	const setName = (inputName) => name = inputName; 
	const setMarker = (choice) => marker = choice.toUpperCase();
	const getMarker = () => marker;
	const resetScore = () => {
		score = 0;
		displayScore();
	};
	const displayScore = () => {
		switch(getMarker())
                {
                        case 'X':
                                document.querySelector('#score-X').textContent = getScore();
                                break;
                        case 'O':
                                document.querySelector('#score-O').textContent = getScore();
                                break;
                        default:
                                document.querySelector('#score-tie').textContent = getScore();
                                break;
                }
	};
	const updateScore = () => {
		score++;
		displayScore();
	};
	const getScore = () => score;

	return { setMarker, getMarker, resetScore, updateScore, getScore };
});

function createLayout() {
	const container = document.createElement('div');
	container.classList.add('main-container');

	for (let i = 0; i < 9; i++)
	{
		const grid = document.createElement('div');
		grid.classList.add('grid');
		grid.setAttribute('id', `grid-${i}`);
		grid.addEventListener('click', Gameboard.play);

		container.appendChild(grid);
	}

	const statusBar = document.createElement('div');
	statusBar.classList.add('status-bar');

	const statusElement = ['Player(X)', 'Draw', 'Player(O)'];
	statusElement.forEach(elt => {
		const elementContainer = document.createElement('div');
		const title = document.createElement('div');
		const score = document.createElement('div');

		elementContainer.classList.add('status-element');
		title.classList.add('title');
		score.classList.add('score');

		if (elt[0] == 'D')
			score.setAttribute('id', 'score-tie');
		else if (elt[7] == 'X')
		{
			score.setAttribute('id', 'score-X');
			title.setAttribute('id', 'first-player');
		}
		else
		{
			score.setAttribute('id', 'score-O');
			title.setAttribute('id', 'second-player');
		}

		title.textContent = elt;
		score.textContent = '0';
		
		elementContainer.appendChild(title);
		elementContainer.appendChild(score);
		statusBar.appendChild(elementContainer);
	});

	const newGameBtn = document.createElement('button');
	newGameBtn.textContent = 'New Game';
	newGameBtn.addEventListener('click', restartGame);

	const inputNameBtn = document.createElement('button');
	inputNameBtn.textContent = 'Add Names';
	inputNameBtn.addEventListener('click', addNames);

	const btnContainer = document.createElement('div');
	btnContainer.classList.add('btn-container');
	btnContainer.appendChild(newGameBtn);
	btnContainer.appendChild(inputNameBtn);

	const copyright = document.createElement('a');
	copyright.textContent = 'Copyright \u00A9 Neil Taison Rigaud';
	copyright.setAttribute('href', 'https://blackbird410.github.io/');
	copyright.target = '_blank';

	document.body.appendChild(container);
	document.body.appendChild(statusBar);
	document.body.appendChild(btnContainer);
	document.body.appendChild(copyright);
}

function addNames()
{
	// Create a simple form that will overlay the game display
	const form = document.createElement('form');
	form.setAttribute('id', 'form');
	
	let i = 1;
	['player-X', 'player-O'].forEach(player => {
		const label = document.createElement('label');
		label.setAttribute('for', player);
		label.textContent = `Player ${i}:`;

		const nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.setAttribute('id', player);
		nameInput.setAttribute('name', player);
		i++;

		form.appendChild(label);
		form.appendChild(nameInput);
	});

	const submitBtn = document.createElement('button');
	const resetBtn =  document.createElement('button');
	submitBtn.type = 'submit';
	resetBtn.type = 'reset';
	submitBtn.textContent = "Submit";
	resetBtn.textContent = "Reset";
	submitBtn.addEventListener('click', validateForm);

	const btnContainer = document.createElement('div');
	btnContainer.classList.add('btn-container');

	btnContainer.appendChild(submitBtn);
	btnContainer.appendChild(resetBtn);
	form.appendChild(btnContainer);
	form.noValidate = true;

	const container = document.querySelector('.main-container');
	container.appendChild(form);
	container.classList.add('container');
	form.classList.add('overlay');
}

function validateForm(e) {
	e.preventDefault();

	const title1 = document.querySelector('#first-player');
	const title2 = document.querySelector('#second-player');
	console.log(title2);
	
	title1.textContent = document.querySelector('input:first-of-type').value;
	title2.textContent = document.querySelector('input:last-of-type').value;

	document.querySelector('form').remove();
	document.querySelector('.main-container').classList.remove('container');
}

createLayout();
const player1 = createPlayer();
const player2 = createPlayer();
const tie = createPlayer();
player1.setMarker('X');
player2.setMarker('O');
