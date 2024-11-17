import AsyncStorage from '@react-native-async-storage/async-storage';


export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    return token;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error; 
  }
};


export const getPuestosInactivos = async () => {
  try {
    const token = await getToken();
    const url = 'http://161.132.55.177/apifundades/api/Puesto/listaInactivos';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al obtener los puestos inactivos');

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error al obtener los puestos inactivos:", error);
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};


export const activatePuesto = async (puesto) => {
  try {
    const token = await getToken();
    const url = `http://161.132.55.177/apifundades/api/Puesto/activar?puesto=${puesto}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Error al activar el puesto');

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Error al activar el puesto:", error);
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};
