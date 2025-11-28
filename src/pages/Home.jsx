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

  const handleDifficultyClick = (dificultad) => {
    navigate("/game", { state: { difficulty: dificultad } });
  };

  return (
    <div className="home-container">
      <h1>Bienvenido al Trivia UNQ</h1>
      <h3>Seleccioná una dificultad para comenzar:</h3>

      <div className="button-container">
        {dificultades.map((diff) => (
          <button key={diff} onClick={() => handleDifficultyClick(diff)}>
            {diff}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
