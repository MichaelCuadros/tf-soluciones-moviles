
import AsyncStorage from '@react-native-async-storage/async-storage';

export const obtenerPuestos = async () => {
  try {
  
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

 
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

// Nueva función para listar postulantes por puesto
export const listarPostulantesPorPuesto = async (puesto) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    // Construir la URL con el formato correcto (por ejemplo, espacios como `+`)
    const url = `http://161.132.55.177/apifundades/api/Puesto/listaPostulantesbyPuesto?puesto=${puesto.replace(/ /g, '+')}`;

    const response = await fetch(url, {
      method: 'POST', // Método POST
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}), // El cuerpo puede ser vacío si no se necesita
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch postulantes');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};
// Función para crear un nuevo puesto
export const crearPuesto = async (nombrePuesto, descripcionPuesto) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await fetch('http://161.132.55.177/apifundades/api/Puesto/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ nombrePuesto, descripcionPuesto }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create puesto');
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};