import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { loginUser } from './services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ViewLogin({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Realizar el login
      const response = await loginUser({ username, password });

      // Verificar respuesta del login
      console.log('Respuesta de login:', response);  // Agregado para depurar

      if (response.success) {
        Alert.alert('Success', response.message);

        // Guardar el usuario en AsyncStorage después del login exitoso
        try {
          // Ajustamos para utilizar el campo 'usuario' como identificador
          const user = { username: response.data.token, name: username };  // Usamos 'username' como 'id'
          await AsyncStorage.setItem('usuario', JSON.stringify(user)); // Guardamos el objeto de usuario en AsyncStorage
          console.log("Usuario guardado:", user);  // Verificación
        } catch (error) {
          console.error('Error al guardar el usuario en AsyncStorage:', error);  // Agregado para depurar
          Alert.alert('Error', 'No se pudo guardar el usuario');
        }

        // Navegar a la pantalla principal después del login
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error en el proceso de login:', error);  // Agregado para capturar errores generales
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
        color="#841584" // Personaliza el color del botón si es necesario
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
