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
    return <div className="loading">Cargando preguntas...</div>;
  }

  const currentQuestion = questions[currentIndex];

  const optionsList = [
    { key: "option1", value: currentQuestion.option1 },
    { key: "option2", value: currentQuestion.option2 },
    { key: "option3", value: currentQuestion.option3 },
    { key: "option4", value: currentQuestion.option4 },
  ];

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentIndex];
    let puntaje = score;

    try {
      const result = await postAnswer(currentQuestion.id, selectedOption);

      if (result.answer) {
        alert("¡Correcto!");
        puntaje++;
        setScore(puntaje);
      } else {
        alert("Incorrecto :(");
      }

      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
      } else {
        //alert("¡Juego terminado!");
        navigate("/result", {
          state: {
            score: puntaje,
            total: questions.length,
          },
        });
      }
    } catch (error) {
      console.error("Error al enviar respuesta", error);
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

        {/* QUEDA MARCADO EL BUTTON CON LA RESPUESTA ANTERIOR, ARREGLAR! */}
        <div className="options-grid">
          {optionsList.map((item) => (
            <button
              key={item.key}
              className="option-btn"
              onClick={() => handleAnswer(item.key)}
            >
              {item.value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
