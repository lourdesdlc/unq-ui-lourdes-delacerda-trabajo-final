import axios from "axios";

const api = axios.create({
  baseURL: "https://preguntados-api.vercel.app/api",
  timeout: 10000,
});

export const getDifficulties = async () => {
  try {
    const response = await api.get("/difficulty");
    return response.data;
  } catch (error) {
    console.error("Error buscando dificultades:", error);
    throw error;
  }
};

export const getQuestions = async (difficulty) => {
  try {
    const response = await api.get("/questions", {
      params: { difficulty: difficulty },
    });
    return response.data;
  } catch (error) {
    console.error("Error buscando preguntas:", error);
    throw error;
  }
};

export const postAnswer = async (questionId, option) => {
  try {
    const response = await api.post("/answer", {
      questionId: questionId,
      option: option,
    });
    return response.data;
  } catch (error) {
    console.error("Error enviando respuesta:", error);
    throw error;
  }
};
