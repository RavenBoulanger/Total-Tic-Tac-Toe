import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
  return (
    <button
      className={`square ${props.winningSquare ? 'winner' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );

}

class Board extends React.Component {
  renderSquare(i, winningSquare) {
    return (
      <Square
        winningSquare={winningSquare}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard(size) {
    const winner = calculateWinner(this.props.squares);
    let board = [];
    for (let i = 0 ; i < size ; i++) {
      let row = [];
      for (let j = 0 ; j < size ; j++) {
        const squareId = i * size + j;
        const winningSquare = winner && winner.line.includes(squareId);
        row.push(
          <React.Fragment
            key={`square${squareId}`}
          >
            {this.renderSquare(squareId, winningSquare)}
          </React.Fragment>
        );
      }
      board.push(<div className="board-row" key={`row${i}`}>{row}</div>);
    }

    return (
      <>
        {board}
      </>
    );
  }

  render() {
    return (
      <div>
        {this.renderBoard(3)}
      </div>
    );
  }
}

class MoveHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descendView: true,
    };
  }

  reverseList() {
    this.setState({
      descendView: !this.state.descendView,
    });
  }

  render() {
    const props = this.props;

    const history = props.history;
    const current = history[props.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const active = props.stepNumber === move;
      const stepIndex = step.stepIndex;
      const coordinates = move ?
        ' (' + ((stepIndex % 3) + 1) + ', ' + (Math.ceil((stepIndex + 1) / 3)) + ')' :
        '';
      const desc = move ?
        'Go to move #' + move + coordinates:
        'Go to game start';
        return (
          <li
            className={`${active ? 'active' : ''}`}
            key={move}
          >
            <button
              onClick={() => props.jumpTo(move)}
            >
              {desc}
            </button>
          </li>
        );
    });

    const orderBtn = this.state.descendView ? 'View newest first' : 'View oldest first';

    return (
      <>
        <button onClick={() => this.reverseList()}>{orderBtn}</button>
        <ol>
          {this.state.descendView ? moves : moves.reverse()}
        </ol>
      </>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        stepIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <MoveHistory
            history={history}
            stepNumber={this.state.stepNumber}
            jumpTo={(step) => this.jumpTo(step)}
          />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        line: lines[i],
        player: squares[a],
      };
    }
  }
  return null;
}
