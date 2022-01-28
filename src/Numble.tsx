import { useMemo } from "react";
import { Backspace, ArrowClockwise } from "phosphor-react";
import styled from "styled-components";

import {
  ANSWER_LENGTH,
  NUM_OF_GUESSES,
  GameStatus,
  SquareStatus,
} from "./service";
import useNumble from "./useNumble";

const colors = {
  green: "#6aaa64",
  yellow: "#c9b458",
  white: "#fff",
  darkGray: "#787c7e",
  lightGray: "#d3d6da",
  gray: "#cbced1",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
  max-width: 500px;
  margin: 0 auto;
  height: 100vh;
  justify-content: space-between;

  .correct {
    background-color: ${colors.green};
    border-color: ${colors.green};
    color: ${colors.white};
  }

  .present {
    background-color: ${colors.yellow};
    border-color: ${colors.yellow};
    color: ${colors.white};
  }

  .absent {
    background-color: ${colors.darkGray};
    border-color: ${colors.darkGray};
    color: ${colors.white};
  }
`;

const Header = styled.header`
  display: flex;
  height: 50px;
  border-bottom: 1px solid ${colors.lightGray};
  align-items: center;

  h1 {
    font-weight: 700;
    font-size: 36px;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    pointer-events: none;
  }
`;

const Square = styled.div`
  border: 2px solid ${colors.lightGray};
  width: 62px;
  height: 62px;
  margin: 3px;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .row {
    display: flex;
  }
`;

type BoardProps = {
  guesses: [number, SquareStatus][][];
  currentGuess: number[];
};

const Board = ({ guesses, currentGuess }: BoardProps) => {
  const guessedRows = useMemo(
    () =>
      guesses.map((guess, rowIdx) => (
        <div key={`guessed-row-${rowIdx}`} className="row">
          {guess.map((square, squareIdx) => (
            <Square key={`square-${rowIdx}-${squareIdx}`} className={square[1]}>
              {square[0]}
            </Square>
          ))}
        </div>
      )),
    [guesses]
  );

  const currentRow = useMemo(() => {
    if (guesses.length === NUM_OF_GUESSES) {
      return [];
    }

    return (
      <div key={`current-row`} className="row">
        {currentGuess.map((value, idx) => (
          <Square key={`square-current-${idx}`}>{value}</Square>
        ))}
        {Array(ANSWER_LENGTH - currentGuess.length)
          .fill(null)
          .map((_, idx) => (
            <Square key={`square-current-empty-${idx}`} />
          ))}
      </div>
    );
  }, [currentGuess, guesses]);

  const emptyRows = useMemo(() => {
    if (guessedRows.length === NUM_OF_GUESSES) {
      return [];
    }

    return Array(NUM_OF_GUESSES - guessedRows.length - 1)
      .fill(null)
      .map((_, rowIdx) => (
        <div key={`empty-row-${rowIdx}`} className="row">
          {Array(ANSWER_LENGTH)
            .fill(null)
            .map((_, squareIdx) => (
              <Square key={`square-empty-${rowIdx}-${squareIdx}`} />
            ))}
        </div>
      ));
  }, [guessedRows]);

  return (
    <BoardContainer>
      {guessedRows}
      {currentRow}
      {emptyRows}
    </BoardContainer>
  );
};

const KeyboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  .row {
    display: flex;
    width: 100%;
  }
`;

const Key = styled.button`
  background-color: ${colors.lightGray};
  border: 0;
  border-radius: 4px;
  display: flex;
  flex: 1;
  height: 60px;
  margin: 3px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;

  &:active {
    background-color: ${colors.gray};
  }
`;

type KeyboardProps = {
  guesses: [number, SquareStatus][][];
  handleKeyPress: (value: number | "Enter" | "Backspace") => void;
};

const Keyboard = ({ guesses, handleKeyPress }: KeyboardProps) => {
  const renderKey = (value: number) => {
    const status = guesses.reduce((_, guess) => {
      return guess.reduce((prev, square) => {
        if (square[0] === value) {
          return square[1];
        }
        return prev;
      }, undefined as SquareStatus | undefined);
    }, undefined as SquareStatus | undefined);

    return (
      <Key
        key={`key${value}`}
        className={status}
        onClick={() => handleKeyPress(value)}
      >
        {value}
      </Key>
    );
  };

  return (
    <KeyboardContainer>
      <div className="row">
        {Array(6)
          .fill(null)
          .map((_, idx) => renderKey(idx + 1))}
      </div>
      <div className="row">
        <Key onClick={() => handleKeyPress("Enter")}>Enter</Key>
        {Array(3)
          .fill(null)
          .map((_, idx) => renderKey(idx + 7))}
        {renderKey(0)}
        <Key onClick={() => handleKeyPress("Backspace")}>
          <Backspace weight="bold" size={24} />
        </Key>
      </div>
    </KeyboardContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 40%;
  left: 50%;
  width: 100%;
  max-width: 500px;
  transform: translate(-50%, -50%);
  background-color: ${colors.white};
  border-radius: 10px;
  box-shadow: 0 4px 23px 0 rgb(0 0 0 / 20%);

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 250px;

    h2 {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 20px;
    }

    button {
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 20px;
      font-size: 20px;
      padding: 8px;
      background-color: ${colors.lightGray};
      border-radius: 4px;
      margin-top: 20px;
      cursor: pointer;
      font-weight: bold;

      &:active {
        background-color: ${colors.gray};
      }

      svg {
        margin-right: 8px;
      }
    }
  }
`;

type ModalProps = {
  gameStatus: GameStatus;
  guessCount: number;
  onReset: () => void;
};

const Modal = ({ gameStatus, guessCount, onReset }: ModalProps) => {
  if (gameStatus === GameStatus.InPlay) {
    return null;
  }

  return (
    <ModalContainer>
      <div className="content">
        <h2 className={gameStatus.toLowerCase()}>You {gameStatus}!</h2>
        {gameStatus === GameStatus.Win && (
          <p>
            You guessed the correct answer in <b>{guessCount}</b> tries.
          </p>
        )}
        <button onClick={onReset}>
          <ArrowClockwise weight="bold" />
          Play Again
        </button>
      </div>
    </ModalContainer>
  );
};

const Numble = () => {
  const { currentGuess, gameStatus, guesses, handleKeyPress, handleReset } =
    useNumble();
  return (
    <Container>
      <Header>
        <h1>Numble</h1>
      </Header>
      <Board guesses={guesses} currentGuess={currentGuess} />
      <Keyboard guesses={guesses} handleKeyPress={handleKeyPress} />
      <Modal gameStatus={gameStatus} guessCount={guesses.length} onReset={handleReset} />
    </Container>
  );
};

export default Numble;
