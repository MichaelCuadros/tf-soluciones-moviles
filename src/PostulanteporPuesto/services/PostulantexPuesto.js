import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para obtener el token desde AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

const API_URL = 'http://161.132.55.177/apifundades/api/Puesto/listaPostulantesbyPuesto';

export const getPostulantesByPuesto = async (puesto) => {
  try {
    // Obtener el token desde AsyncStorage
    const token = await getToken(); 
    const url = `${API_URL}?puesto=${encodeURIComponent(puesto)}`;

    // Hacer la solicitud POST a la API
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // Incluir el token en los headers
        'accept': 'application/json',
      },
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) throw new Error('Error al obtener los postulantes');

    // Convertir la respuesta en formato JSON
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al obtener los postulantes:', error);
    return { success: false, message: error.message || 'Hubo un problema al obtener los postulantes' };
  }
};
