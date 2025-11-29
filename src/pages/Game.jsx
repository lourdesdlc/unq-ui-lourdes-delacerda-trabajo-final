import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestions, postAnswer } from "../services/api";
import "../index.css";

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get("difficulty") || "easy";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        const data = await getQuestions(difficulty);

        setQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => {
      controller.abort();
    };
  }, [difficulty]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando preguntas...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const optionsList = [
    { key: "option1", value: currentQuestion.option1 },
    { key: "option2", value: currentQuestion.option2 },
    { key: "option3", value: currentQuestion.option3 },
    { key: "option4", value: currentQuestion.option4 },
  ];

  const handleAnswer = async (itemKey) => {
    if (selectedOption) return;
    setSelectedOption(itemKey);

    const currentQuestion = questions[currentIndex];

    try {
      const result = await postAnswer(currentQuestion.id, itemKey);
      setIsCorrect(result.answer);

      let newScore = score;
      if (result.answer) {
        newScore++;
      }

      setTimeout(() => {
        {
          if (result.answer) setScore(newScore);
          const nextIndex = currentIndex + 1;
          if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setSelectedOption(null);
            setIsCorrect(null);
          } else {
            navigate("/result", {
              state: { score: newScore, total: questions.length },
            });
          }
        }
      }, 1500);
    } catch (error) {
      console.error("Error al enviar respuesta", error);
      setSelectedOption(null);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <span className="score-counter">Puntos: {score}</span>
        <span>Dificultad: {difficulty}</span>
        <span>
          Pregunta {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="question-card">
        <h2>{currentQuestion.question}</h2>

        <div className="options-grid">
          {optionsList.map((item) => {
            let buttonClass = "option-btn";
            if (selectedOption === item.key) {
              if (isCorrect === true) buttonClass += " correct";
              if (isCorrect === false) buttonClass += " incorrect";
            }
            return (
              <button
                key={item.key}
                className={buttonClass}
                onClick={() => handleAnswer(item.key)}
                disabled={selectedOption !== null}
              >
                {item.value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
