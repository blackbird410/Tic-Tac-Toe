const EMPTY = '.';
const VALID = true;

const Gameboard = (function () {
	let board = [
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
	];

	let turn = 'X';
	let winner = EMPTY;
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
		Array.from(document.querySelectorAll('.grid')).forEach(grid => grid.textContent = '');
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
		
		if (isGameOver())
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
	}

	function isGameOver()
	{
		let i = 0;
		for (i = 0; i < 3; i++)
		{
			if(board[i][0] != EMPTY && board[i][0] == board[i][1] && board[i][1] == board[i][2])
			{
				winner = board[i][0];
				return true;
			}
		}

		for (i = 0; i < 3; i++)
		{
			if (board[0][i] != EMPTY && board[0][i] == board[1][i] && board[1][i] == board[2][i])
			{
				winner = board[0][i];
				return true;
			}
		}

		if (board[0][0] != EMPTY && board[0][0] == board[1][1] && board[1][1] == board[2][2]
			|| (board[0][2] != EMPTY && board[0][2] == board[1][1] && board[1][1] == board[2][0]))
		{
			winner = board[1][1];
			return true;
		}

		if (gridMarked == 9)
			return true;
		
		return false;
	}

	return { play, isGameOver }

})();

const createPlayer =  (function () {
	let marker = EMPTY;
	let score = 0;

	const setMarker = (choice) => marker = choice.toUpperCase();
	const getMarker = () => marker;
	const resetScore = () => score = 0;
	const updateScore = () => {
		score++;
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

	const statusElement = ['Player(X)', 'Tie', 'Player(O)'];
	statusElement.forEach(elt => {
		const elementContainer = document.createElement('div');
		const title = document.createElement('div');
		const score = document.createElement('div');

		elementContainer.classList.add('status-element');
		title.classList.add('title');
		score.classList.add('score');

		if (elt[0] == 'T')
			score.setAttribute('id', 'score-tie');
		else if (elt[7] == 'X')
			score.setAttribute('id', 'score-X');
		else
			score.setAttribute('id', 'score-O');

		title.textContent = elt;
		score.textContent = '0';
		
		elementContainer.appendChild(title);
		elementContainer.appendChild(score);
		statusBar.appendChild(elementContainer);
	});

	document.body.appendChild(container);
	document.body.appendChild(statusBar);
}

createLayout();
const player1 = createPlayer();
const player2 = createPlayer();
const tie = createPlayer();
player1.setMarker('X');
player2.setMarker('O');
