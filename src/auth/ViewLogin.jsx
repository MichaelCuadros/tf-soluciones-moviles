import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { loginUser } from './services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
    
      const response = await loginUser({ username, password });

    
      console.log('Respuesta de login:', response);  

      if (response.success) {
        Alert.alert('Success', response.message);

    
        try {
         
          const user = { username: response.data.token, name: username };  
          await AsyncStorage.setItem('usuario', JSON.stringify(user)); 
          console.log("Usuario guardado:", user);  
        } catch (error) {
          console.error('Error al guardar el usuario en AsyncStorage:', error);  
          Alert.alert('Error', 'No se pudo guardar el usuario');
        }

     
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error en el proceso de login:', error);  
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
        color="#841584" 
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8', // Fondo azul claro
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28, // Tamaño de fuente aumentado
    fontWeight: '700', // Negrita
    color: '#013a63', // Azul oscuro
    marginBottom: 20, // Espacio debajo del título
  },
  input: {
    width: '80%',
    padding: 12, // Mayor padding para comodidad
    marginVertical: 12, // Más espacio entre los inputs
    borderWidth: 1,
    borderRadius: 8, // Bordes más redondeados
    borderColor: '#fbb034', // Bordes amarillos
    fontSize: 16, // Tamaño de fuente más grande
    backgroundColor: '#fff', // Fondo blanco para el input
  },
});
