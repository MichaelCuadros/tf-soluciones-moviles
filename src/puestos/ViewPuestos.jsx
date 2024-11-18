import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { obtenerPuestos, listarPostulantesPorPuesto } from './services/Puestos';

const ViewPuestos = ({ navigation }) => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Cargar el rol del usuario al inicio
  useEffect(() => {
    const cargarRol = async () => {
      const rol = await AsyncStorage.getItem('rolAPP');
      setIsAdmin(rol === 'Admin');
    };
    cargarRol();
  }, []);

  // Cargar los puestos
  useEffect(() => {
    const cargarPuestos = async () => {
      setLoading(true);
      const result = await obtenerPuestos();
      if (result.success) {
        setPuestos(result.data);
      } else {
        Alert.alert('Error', result.message || 'Error al cargar los puestos.');
      }
      setLoading(false);
    };
    cargarPuestos();
  }, []);

  const handleAplicar = async (puesto) => {
    const username = await AsyncStorage.getItem('username'); // Usuario actual
    if (!username) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }
  
    try {
      // Llamar a la función para listar postulantes
      const response = await listarPostulantesPorPuesto(puesto.nombrePuesto);
  
      if (response.success) {
        const yaAplicado = response.data.some((postulante) => postulante.usuario === username);
  
        if (yaAplicado) {
          // Mostrar mensaje y no permitir avanzar
          Alert.alert('Información', 'Ya aplicaste a esta oferta de trabajo.');
          return;
        }
  
        // Si no aplicó, redirigir a Cuestionarios
        navigation.navigate('Cuestionarios', { puestoTrabajo: puesto });
      } else {
        Alert.alert('Ya Aplicaste',  'Ya aplicaste');
      }
    } catch (error) {
      Alert.alert('Error', 'Ya aplicaste a esta oferta de trabajo');
    }
  };
  
  // Renderizar cada puesto en la lista
  const renderPuesto = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>{item.nombrePuesto}</Text>
        <Text style={styles.itemDescription}>{item.descripcionPuesto}</Text>
        <TouchableOpacity
          style={styles.buttonActive}
          onPress={() => handleAplicar(item)}
        >
          <Text style={styles.buttonText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Puestos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#013a63" />
      ) : (
        <FlatList
          data={puestos}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={renderPuesto}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e8f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#013a63',
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#fbb034',
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#013a63',
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  buttonActive: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#fbb034',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ViewPuestos;
