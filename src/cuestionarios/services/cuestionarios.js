// service/cuestionarios.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const obtenerCuestionarios = async () => {
  try {
    // Obtener el token desde AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await fetch('http://161.132.55.177/apifundades/listaCuestionario', {
      method: 'POST', // Cambia el método a POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Incluir token en el encabezado Authorization
      },
      body: JSON.stringify({}), // Enviar un cuerpo vacío si es necesario
    });

    if (!response.ok) throw new Error('Failed to fetch questionnaires');

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};
