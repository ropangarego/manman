interface AnswerGridProps {
  answers: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  disabled?: boolean;
  onSelect: (answer: string) => void;
}

export function AnswerGrid({ answers, correctAnswer, selectedAnswer, disabled = false, onSelect }: AnswerGridProps) {
  return (
    <div className="answer-grid">
      {answers.map((answer) => {
        const selected = selectedAnswer === answer;
        const stateClass = selected ? (answer === correctAnswer ? 'correct' : 'wrong') : '';
        return (
          <button
            className={stateClass}
            disabled={disabled}
            key={answer}
            type="button"
            onClick={() => onSelect(answer)}
          >
            {answer}
          </button>
        );
      })}
    </div>
  );
}

