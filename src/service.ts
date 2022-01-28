export const ANSWER_LENGTH = 5;

export const NUM_OF_GUESSES = 5;

export enum GameStatus {
  Win,
  Lose,
  InPlay,
}

export enum SquareStatus {
  Correct = "correct",
  Present = "present",
  Absent = "absent",
}

export const generateAnswer = (
  nums: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  answer: number[] = []
): number[] => {
  if (answer.length < ANSWER_LENGTH) {
    const idx = Math.floor(Math.random() * answer.length);
    const newAnswer = [...answer, nums[idx]];
    nums.splice(idx, 1);
    return generateAnswer(nums, newAnswer);
  }

  return answer;
};
