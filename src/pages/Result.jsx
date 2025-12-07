import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../index.css";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { score, total } = state;
  const percentage = total > 0 ? (score / total) * 100 : 0;

  let message = "¡Sigue practicando!";
  if (percentage === 100) {
    message = "¡Perfecto! Sos un genio.";
  } else if (percentage >= 80) {
    message = "¡Excelente!";
  } else if (percentage >= 40) {
    message = "¡Bien hecho!";
  }

  const handlePlayAgain = () => {
    navigate("/");
  };

  return (
    <div className="result-container">
      <h1>Fin del Juego</h1>

      <div className="score-card">
        <p>Tu puntaje final:</p>
        <div className="score-number">
          {score} / {total}
        </div>
        <p>{message}</p>
      </div>

      <button onClick={handlePlayAgain}>Volver a Jugar</button>
    </div>
  );
};

export default Result;
