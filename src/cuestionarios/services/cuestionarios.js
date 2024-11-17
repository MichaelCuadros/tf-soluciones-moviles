
import AsyncStorage from '@react-native-async-storage/async-storage';

export const obtenerCuestionarios = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    console.log('Token de autenticación:', token); // Agrega un log para verificar el token

    const response = await fetch('http://161.132.55.177/apifundades/listaCuestionario', {
      method: 'Get', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) throw new Error('Failed to fetch questionnaires');

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }

};

export const registrarCuestionario = async (data) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await fetch('http://161.132.55.177/apifundades/registrarCuestionario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar el cuestionario');
    }

    const result = await response.json();
    if (!result || typeof result !== 'object' || !result.resultado) {
      throw new Error('Formato inesperado en la respuesta del servidor');
    }

    return {
      success: true,
      message: 'Cuestionario registrado correctamente',
      data: result
    };

  } catch (error) {
    console.error('Error en registrarCuestionario:', error.message || error);
    return {
      success: false,
      message: error.message || 'Ocurrió un error en el servidor'
    };
  }
};

