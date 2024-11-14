import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewHome = ({ navigation }) => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
        } else {
          Alert.alert('Error', 'No token found');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to retrieve token');
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      Alert.alert('Logged out', 'You have been logged out');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const handleListQuestionnaires = () => {
    Alert.alert('Action', 'Listar Cuestionarios pressed');
    navigation.navigate('Cuestionarios');
  };

  const handlePuestosTrabajo = () => {
    Alert.alert('Action', 'Puestos de trabajo pressed');
    navigation.navigate('PuestosTrabajo'); 
  };

  const handleOpenURL = () => {
    const url = 'https://fundades.org/';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la URL');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a FUNDADES</Text>
      <Text style={styles.subtitle}>Por un Perú más inclusivo</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePuestosTrabajo}>
          <Text style={styles.buttonText}>Puestos de trabajo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOpenURL}>
          <Text style={styles.buttonText}>Ir a página</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8', // Un tono suave de azul
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#013a63', // Azul oscuro para destacar
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fbb034', // Amarillo para reflejar el color de FUNDADES
    fontWeight: '600',
    marginBottom: 20,
  },
  token: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#013a63', // Azul oscuro para los botones principales
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    marginVertical: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ViewHome;
