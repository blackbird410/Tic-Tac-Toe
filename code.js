const EMPTY = '.';
const VALID = true;

const Gameboard = (function () {
	let board = [
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
		[EMPTY, EMPTY, EMPTY],
	];

	let turn = 'X';
	let gameOver = false;
	let gridMarked = 0;

	const setTurn = () => turn = (turn == 'X') ? 'O' : 'X';
	const getTurn = () => turn;

	const setGameOver = () => gameOver = true;
	const isGameOver = () => gameOver;
	const getBoard = () => board;

	const getWinner = () => checkWinner();
	const updateGridMarked = () => gridMarked++;
	const getGridMarked = () => gridMarked;

	const newGame = () => {
		resetBoard();
		gameOver = false;
		gridMarked = 0;
	};

	function displayBoard() {
		for (let i = 0; i < 9; i++)
			document.querySelector(`#grid-${i}`).textContent = (board[Math.floor(i / 3)][i % 3] != EMPTY) ? board[Math.floor(i / 3)][i % 3] : ''; 
	};

	function resetBoard() {
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				board[i][j] = EMPTY;
		displayBoard();
	};

	function play(e) {
		let marker = getTurn();
		let id =  e.currentTarget.id.split('-')[1];
		let [row, col] = [Math.floor(id / 3), id % 3];
		
		if (!isGameOver() && board[row][col] == EMPTY)
		{
			board[row][col] = marker;
			updateGridMarked();
			setTurn();
			//e.currentTarget.textContent = marker;
			displayBoard();
		}
		else if (isGameOver() && getGridMarked() < 9)
			console.log('GAME OVER!!!!');
		
		if (getWinner() != EMPTY)
		{
			if (getWinner() == 'X')
				player1.updateScore();
			else
				player2.updateScore();
			newGame();
		}
		else if (isGameOver())
		{
			tie.updateScore();
			newGame();
		}
	};

	function checkWinner() {
		// Check rows
		board.forEach(row => {
			if (row[0] != EMPTY && row[0] == row[1] && row[0] == row[2])
			{
				setGameOver();
				return row[0];
			}
		});

		// Check cols
		for (let i = 0; i < 3; i++)
		{
			if (board[0][i] != EMPTY && board[0][i] == board[1][i] && board[0][i] == board[2][i])
			{
				setGameOver();
				return board[0][i];
			}
		}

		// Check both diagonals
		if ((board[0][0] != EMPTY && board[0][0] == board[1][1] && board[0][0] == board[2][2]) 
			|| (board[0][2] != EMPTY && board[0][2] == board[1][1] && board[0][2] == board[2][0]))
		{
			setGameOver();
			return board[1][1];
		}

		if (getGridMarked() == 9)
			setGameOver();

		return EMPTY;
	}

	return { getBoard, isGameOver, setTurn, getTurn, play, checkWinner, getWinner, newGame };
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
