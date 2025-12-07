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

  let message = "¡Sigue practicando! 😭";
  if (percentage === 100) {
    message = "¡Perfecto! Sos un genio. 🥳";
  } else if (percentage >= 80) {
    message = "¡Excelente! 😁";
  } else if (percentage >= 40) {
    message = "¡Bien hecho! 😊";
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={70}
            height={70}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
            ></path>
          </svg>
          {score}/{total}
        </div>
        <p>{message}</p>
      </div>

      <button onClick={handlePlayAgain}>Volver a Jugar</button>
    </div>
  );
};

export default Result;
