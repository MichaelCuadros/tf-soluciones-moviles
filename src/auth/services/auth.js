
import UserModel from '../models/user';
import AuthModel from '../models/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const registerUser = async (formData) => {
  const user = new UserModel(formData);

  try {
    const response = await fetch('http://161.132.55.177/apifundades/api/User/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.toJSON()),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to register user');
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};

export const loginUser = async (formData) => {
  const authData = new AuthModel(formData);

  try {
    const response = await fetch('http://161.132.55.177/apifundades/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authData.toJSON()),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login failed');

    // Guardar el token, el rol y el usuario en AsyncStorage
    await AsyncStorage.setItem('authToken', result.token);
    await AsyncStorage.setItem('rolAPP', result.rol);
    await AsyncStorage.setItem('username', authData.username); // Guardar el usuario

    return { success: true, message: 'User logged in successfully', data: result };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred. Please try again later.' };
  }
};
