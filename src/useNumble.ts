import { useEffect, useState } from "react";

import {
  GameStatus,
  SquareStatus,
  generateAnswer,
  ANSWER_LENGTH,
} from "./service";

type UseNumbleProps = {
  currentGuess: number[];
  gameStatus: GameStatus;
  guesses: [number, SquareStatus][][];
  handleKeyPress: (value: number | "Enter" | "Backspace") => void;
  handleReset: () => void;
};

const useNumble = (): UseNumbleProps => {
  const [answer, setAnswer] = useState(generateAnswer());
  const [gameStatus, setGameStatus] = useState(GameStatus.InPlay);
  const [guesses, setGuesses] = useState<[number, SquareStatus][][]>([]);
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);

  const performGuess = () => {
    const guess: [number, SquareStatus][] = currentGuess.map((num, idx) => {
      let status: SquareStatus;
      if (num === answer[idx]) {
        status = SquareStatus.Correct;
      } else if (answer.includes(num)) {
        status = SquareStatus.Present;
      } else {
        status = SquareStatus.Absent;
      }
      return [num, status];
    });

    setGuesses((prev) => [...prev, guess]);
    setCurrentGuess([]);
  };

  const handleKeyPress = (value: number | "Enter" | "Backspace") => {
    if (value === "Enter") {
      currentGuess.length === ANSWER_LENGTH && performGuess();
      return;
    }

    if (value === "Backspace") {
      currentGuess.length > 0 &&
        setCurrentGuess((prev) =>
          prev.filter((_, idx) => idx < prev.length - 1)
        );
      return;
    }

    currentGuess.length < ANSWER_LENGTH &&
      setCurrentGuess((prev) => [...prev, value as number]);
  };

  const handleReset = () => {
    setGuesses([]);
    setAnswer(generateAnswer());
    setGameStatus(GameStatus.InPlay);
  };

  useEffect(() => {
    if (guesses.length > 0) {
      if (guesses[guesses.length - 1].map((guess) => guess[0]).join("") === answer.join("")) {
        setGameStatus(GameStatus.Win);
        return;
      }

      if (guesses.length === ANSWER_LENGTH) {
        setGameStatus(GameStatus.Lose);
      }
    }
  }, [guesses, answer]);

  return {
    currentGuess,
    gameStatus,
    guesses,
    handleKeyPress,
    handleReset,
  };
};

export default useNumble;
