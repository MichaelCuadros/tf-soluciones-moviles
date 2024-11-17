

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


export const createPuesto = async (nombrePuesto, descripcionPuesto) => {
  try {
    const token = await getToken();
    const url = 'http://161.132.55.177/apifundades/api/Puesto/create';
    const data = { nombrePuesto, descripcionPuesto };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al crear el puesto');

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};


export const deactivatePuesto = async (token, puesto) => {
    try {
      const url = `http://161.132.55.177/apifundades/api/Puesto/desactivar?puesto=${puesto}`;
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) throw new Error('Error al desactivar el puesto');
  
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.log("Error al desactivar el puesto:", error);
      return { success: false, message: error.message || 'An error occurred. Please try again later.' };
    }
  };
  
