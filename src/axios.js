import axios from 'axios';

let API_URL = 'http://localhost:8080/api/movies'; // Corregido el URL base de la API

const postCategorias = async (genres) => {
  try {
    const response = await axios.post(`${API_URL}/genres`, genres); // Usando Axios para hacer la petición POST
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error(error);
    throw error; // Propaga el error para manejarlo en el componente Vue
  }
}

const postPeliculas = async (movies) => {
  try {
    const response = await axios.post(`${API_URL}/movies`, movies); // Usando Axios para hacer la petición POST
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error(error);
    throw error; // Propaga el error para manejarlo en el componente Vue
  }
}

export default {
  postCategorias, // Exporta la función postCategorias
  postPeliculas, // Exporta la función postPeliculas
};
