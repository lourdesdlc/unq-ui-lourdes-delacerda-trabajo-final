import "../index.css";

const QuestionCard = ({
  question,
  options,
  selectedOption,
  isCorrect,
  onAnswer,
  isDisabled,
}) => {
  return (
    <div className="question-card">
      <h2>{question}</h2>

      <div className="options-grid">
        {options.map((item) => {
          let buttonClass = "option-btn";

          if (selectedOption === item.key) {
            buttonClass += " selected";

            if (isCorrect === true) buttonClass += " correct";
            if (isCorrect === false) buttonClass += " incorrect";
          }

          return (
            <button
              key={item.key}
              className={buttonClass}
              onClick={() => onAnswer(item.key)}
              disabled={isDisabled}
            >
              {item.value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
