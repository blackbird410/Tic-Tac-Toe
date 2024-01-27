createLayout();

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

	const setTurn = () => (turn == 'X') ? 'O' : 'X';
	const getTurn = () => turn;

	const setGameOver = () => gameOver = true;
	const isGameOver = () => gameOver;
	const getBoard = () => board;
	
	function resetBoard() {
		for (let i = 0; i < 3; i++)
			for (let j = 0; j < 3; j++)
				board[i][j] = EMPTY;
	};

	function play(getTurn, row, col) {
		let winner = checkWinner();
		if (winner != EMPTY)
			console.log(`${winner} wins!`);

		if (!isGameOver() && board[row][col] == EMPTY)
		{
			board[row][col] = marker;
			return VALID;
		}
		else if (!isGameOver() && board[row][col] != EMPTY)
			console.log('CANNOT PLAY HERE!!!');
		else
			console.log('GAME OVER!!!!');
		return !VALID;
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
			|| (board[0][2] != EMPTY && board[0][2] == board[1][1] && board[2][0]))
		{
			setGameOver();
			return board[1][1];
		}

		return EMPTY;
	}

	return { getBoard, isGameOver, setTurn, getTurn, play, checkWinner, resetBoard };
})();

const createPlayer =  (function () {
	let marker = EMPTY;
	let score = 0;

	const setMarker = (choice) => marker = choice.toUpperCase();
	const getMarker = () => marker;
	const updateScore = () => score++;
	const getScore = () => score;

	return { setMarker, getMarker, updateScore, getScore };
});



const newGame = (function () {
	Gameboard.resetBoard()

	const player1 = createPlayer();
	const player2 = createPlayer();

	player1.setMarker('X');
	player2.setMarker('O');

	// Game simulation
	Gameboard.play(player1.getMarker(), 1, 1);
	Gameboard.play(player2.getMarker(), 1, 1);
	Gameboard.play(player2.getMarker(), 1, 0);

        Gameboard.play(player1.getMarker(), 2, 2);
	Gameboard.play(player2.getMarker(), 0, 0);

	Gameboard.play(player1.getMarker(), 2, 0);
        Gameboard.play(player2.getMarker(), 2, 1);

	Gameboard.play(player1.getMarker(), 0, 2);
        Gameboard.play(player2.getMarker(), 1, 1);
});


function createLayout() {
	const container = document.createElement('div');
	container.classList.add('main-container');

	for (let i = 0; i < 9; i++)
	{
		const grid = document.createElement('div');
		grid.classList.add('grid');
		grid.setAttribute('id', `grid-${i}`);
		grid.textContent = (i % 2) ? 'O' : 'X';
		container.appendChild(grid);
	}
	document.body.appendChild(container);
}
