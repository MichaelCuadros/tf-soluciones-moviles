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
          // Aquí guardamos tanto el token, como el username y el rol
          const user = { 
            token: response.data.token, 
            username: username,
            rol: response.data.rol // Guardamos el rol
          };
          await AsyncStorage.setItem('usuario', JSON.stringify(user));
          console.log("Usuario guardado:", user);
        } catch (error) {
          console.error('Error al guardar el usuario en AsyncStorage:', error);
          Alert.alert('Error', 'No se pudo guardar el usuario');
        }

        // Navegar a la pantalla Home
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
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#013a63',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#fbb034',
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
