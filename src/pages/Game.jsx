import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getQuestions, postAnswer } from "../services/api";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const location = useLocation();
  const difficulty = location.state?.difficulty || "easy";
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      //ACA HAY UN BUG, SE MUESTRA DOS PREGUNTAS, UNA CON LA DIFICULTAD VIEJA
      //Y RAPIDAMENTE LA NUEVA DIFICULTAD QUE ELEJIMOS
      try {
        const data = await getQuestions(difficulty);

        //ACA SE PUEDE VER QUE LLEGAN DOS preguntas!
        console.log("Datos que llegaron de la API:", data);

        setQuestions(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [difficulty]);

  if (isLoading) {
    return <div className="loading">Cargando preguntas...</div>;
  }

  const currentQuestion = questions[currentIndex];
  //siempre son 4 preguntas en la api
  const optionsList = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ];

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentIndex];

    // NO HAY RESPUESTA CORRECTA? NO EXISTE /answer??
    console.log("Enviando respuesta...");
    console.log("ID Pregunta:", currentQuestion.id);
    console.log("Opción elegida:", selectedOption);
    // -------------------

    try {
      const result = await postAnswer(currentQuestion.id, selectedOption);

      if (result.answer) {
        alert("¡Correcto!");
        // SUMAR PUNTOS
      } else {
        alert("Incorrecto :(");
      }

      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
      } else {
        alert("¡Juego terminado!");
        navigate("/result");
      }
    } catch (error) {
      console.error("Error al enviar respuesta", error);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <span>Dificultad: {difficulty}</span>
        <span>
          Pregunta {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="question-card">
        <h2>{currentQuestion.question}</h2>

        <div className="options-grid">
          {optionsList.map((option, index) => (
            <button
              key={`${index}-${option}`}
              className="option-btn"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
