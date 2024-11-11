// service/puestos.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const obtenerPuestos = async () => {
  try {
    // Obtener el token desde AsyncStorage
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    // Realizar la solicitud a la API
    const response = await fetch('http://161.132.55.177/apifundades/listaPuestos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) throw new Error('Failed to fetch puestos');

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};
