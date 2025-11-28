import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const total = location.state?.total || 0;

  const percentage = total > 0 ? (score / total) * 100 : 0;
  let message = "¡Sigue practicando!";
  if (percentage >= 50) message = "¡Bien hecho!";
  if (percentage >= 80) message = "¡Excelente!";
  if (percentage === 100) message = "¡Perfecto! Sos un genio.";

  const handlePlayAgain = () => {
    navigate("/");
  };

  return (
    <div className="result-container">
      <h1>Fin del Juego</h1>

      <div className="score-card">
        <p className="score-text">Tu puntaje final:</p>
        <div className="score-number">
          {score} / {total}
        </div>
        <p className="message">{message}</p>
      </div>

      <button className="play-again-btn" onClick={handlePlayAgain}>
        Volver a Jugar
      </button>
    </div>
  );
};

export default Result;
