import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

// render a button
// function components for component that only has a render method, doesn't have internal state
function Square(props) {
  return (
    <button
      className={"square " + (props.highlight ? "highlight" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
  /* return React.createElement(
       "button",
       { className: "square", onClick: props.onClick },
       props.value
     );
  */
}

// Render 9 squares
class Board extends React.Component {
  renderSquare(i) {
    // get called when the square is clicked
    let winningSquare = false;
    if (this.props.winningPos && this.props.winningPos.indexOf(i) >= 0) {
      // If there is a winning position and positions exist on board
      winningSquare = true;
    }
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        highlight={winningSquare}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// render a board with placeholders, displays next player and movement history
class Game extends React.Component {
  constructor(props) {
    // super(props) should be called before other statements, otherwise this.prop will be undefined
    super(props);
    // initialize state
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAsce: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      // if winner is determined or if square is filled, do nothing when click
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  // sort moves list
  reverseMoves() {
    this.setState({
      isAsce: !this.state.isAsce
    });
  }

  render() {
    // squares arrays that record move in each step
    // e.g. [{"squares":[null,null,null,null,null,null,null,null,null]},{"squares":[null,null,null,null,"X",null,null,null,null]}]
    const history = this.state.history;

    // squares array that includes all moves made including current step
    // e.g. {"squares":[null,null,null,null,"X","O",null,null,null]}
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // step is an array of all moves made
    // move is the number of current movement
    const moves = history.map((step, move) => {
      const isCurrent = this.state.stepNumber === move;
      const desc = move ? "Go to move #" + move : "Go to game start";

      return (
        /*  A list needs keys if either of the following are true:
            1. The list-items have memory from one render to the next. 
               Ex: when a to-do list renders, each item must "remember" whether it was checked off.
            2. A list's order might be shuffled. Ex: a list of search results might be shuffled from one render to the next. */
        // bold current movement list item
        <li key={move}>
          <button
            className={isCurrent ? "bold" : ""}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let winPos;
    if (winner) {
      status = "Winner: " + winner.winner;
      winPos = winner.winPos;
    } else if (!current.squares.includes(null) && !winner) {
      // if all squares are filled and there's no winner, it's a draw
      status = "It's a draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winningPos={winPos}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button className="reverse" onClick={() => this.reverseMoves()}>Reverse list</button>
          <ol>{this.state.isAsce ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winPos: lines[i]
      };
    }
  }
  return null;
}
