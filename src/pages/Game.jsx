import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestions, postAnswer } from "../services/api";
import QuestionCard from "../components/QuestionCard";
import AudioPlayer from "../components/AudioPlayer";

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
  const [apiError, setApiError] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);

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

  const handleAnswer = async (itemKey) => {
    if (selectedOption) return;
    setSelectedOption(itemKey);
    setApiError(null);
    const currentQuestion = questions[currentIndex];

    try {
      const result = await postAnswer(currentQuestion.id, itemKey);
      setSelectedSound({ audio: result.answer ? 0 : 1 });
      setIsCorrect(result.answer);

      let currentScore = score;
      if (result.answer) {
        currentScore = score + 1;
        setScore(currentScore);
      }

      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentIndex(nextIndex);
          setSelectedOption(null);
          setIsCorrect(null);
        } else {
          const finalSoundIndex = currentScore < 4 ? 2 : 3;
          setSelectedSound({ audio: finalSoundIndex });
          navigate("/result", {
            state: { score: currentScore, total: questions.length },
          });
        }
      }, 1500);
    } catch (error) {
      console.error("Error al enviar respuesta", error);
      setApiError("Hubo un problema de conexion. Intente de nuevo.");
      setSelectedOption(null);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando preguntas...</p>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="game-container">
        <p>No hay preguntas disponibles.</p>
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

  return (
    <div className="game-container">
      <div className="game-header">
        <span>Puntos: {score}</span>
        <span>Dificultad: {difficulty}</span>
        <span>
          Pregunta {currentIndex + 1} / {questions.length}
        </span>
      </div>
      {apiError && (
        <p style={{ color: "red", marginBottom: "10px" }}>{apiError}</p>
      )}

      <AudioPlayer selectedSound={selectedSound}></AudioPlayer>
      <QuestionCard
        question={currentQuestion.question}
        options={optionsList}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        onAnswer={handleAnswer}
        isDisabled={selectedOption !== null}
      />
    </div>
  );
};

export default Game;
