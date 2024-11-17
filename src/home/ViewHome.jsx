import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewHome = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('usuario');
        if (userData) {
          const parsedData = JSON.parse(userData);
          setToken(parsedData.token);
          setRol(parsedData.rol);
        } else {
          Alert.alert('Error', 'No se encontraron datos del usuario');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudieron recuperar los datos del usuario');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    }
  };

  const handlePuestosTrabajo = () => {
    navigation.navigate('PuestosTrabajo');
  };

  const handlePuestosActivosAdmin = () => {
    Alert.alert('Acción', 'Administración de Puestos Activos');
    navigation.navigate('PuestosActivosAdmin');
  };

  const handlePuestosInactivosAdmin = () => {
    Alert.alert('Acción', 'Administración de Puestos Inactivos');
    navigation.navigate('PuestosInactivosAdmin');
  };

  const handlePostulantesxPuestos = () => {
    Alert.alert('Acción', 'Ver Postulantes por Puestos');
    navigation.navigate('PostulantesxPuestos');
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
        {rol === 'Admin' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handlePuestosActivosAdmin}>
              <Text style={styles.buttonText}>Administración de Puestos Activos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePuestosInactivosAdmin}>
              <Text style={styles.buttonText}>Administración de Puestos Inactivos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePostulantesxPuestos}>
              <Text style={styles.buttonText}>Ver Postulantes por Puestos</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#013a63',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#fbb034',
    fontWeight: '600',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#013a63',
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
