import React, { useState, useEffect } from "react";
import { getDifficulties } from "../services/api";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [dificultades, setDificultades] = useState([]);

  useEffect(() => {
    const fetchDificultades = async () => {
      try {
        const data = await getDifficulties();

        setDificultades(data);
      } catch (error) {
        console.error("No se pudieron cargar las dificultades", error);
      }
    };

    fetchDificultades();
  }, []);

  const handleDifficultyClick = (difficulty) => {
    navigate(`/game?difficulty=${difficulty}`);
  };

  return (
    <div className="home-container">
      <h1>Trivia UNQ</h1>
      <h3>Seleccioná una dificultad para comenzar:</h3>
      {dificultades.length === 0 ? (
        <p>Cargando dificultades...</p>
      ) : (
        <div className="button-container">
          {dificultades.map((diff) => (
            <button
              key={diff}
              className="difficulty-btn"
              onClick={() => handleDifficultyClick(diff)}
            >
              {diff}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
