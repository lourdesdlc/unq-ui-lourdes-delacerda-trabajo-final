import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestions, postAnswer } from "../services/api";
import QuestionCard from "../components/QuestionCard";
import AudioPlayer from "../components/AudioPlayer";
import ProgressBar from "../components/ProgressBar";
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
        <a href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17.414 6.586a2 2 0 0 0-2.828 0L12 9.172L9.414 6.586a2 2 0 1 0-2.828 2.828L9.171 12l-2.585 2.586a2 2 0 1 0 2.828 2.828L12 14.828l2.586 2.586c.39.391.902.586 1.414.586s1.024-.195 1.414-.586a2 2 0 0 0 0-2.828L14.829 12l2.585-2.586a2 2 0 0 0 0-2.828"
            ></path>
          </svg>
        </a>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
        <span className="points">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
            ></path>
          </svg>
          {score}
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
