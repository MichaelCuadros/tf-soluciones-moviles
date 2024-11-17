import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { obtenerPuestos } from '../puestos/services/Puestos';
import { createPuesto, deactivatePuesto } from './services/PuestosAdmin'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewPuestosAdmin = () => {
  const [puestos, setPuestos] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  const [nombrePuesto, setNombrePuesto] = useState('');  
  const [descripcionPuesto, setDescripcionPuesto] = useState('');  
  const [nombrePuestoDesactivar, setNombrePuestoDesactivar] = useState('');  


  useEffect(() => {
    const fetchPuestos = async () => {
      const result = await obtenerPuestos();  
      if (result.success) {
        setPuestos(result.data); 
      } else {
        setError(result.message); 
      }
      setLoading(false);  
    };

    fetchPuestos();
  }, []); 

 
  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );


  const renderPuesto = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => setNombrePuestoDesactivar(item.nombrePuesto)}
    >
      <Text style={styles.itemTitle}>{item.nombrePuesto}</Text>
      <Text style={styles.itemDescription}>{item.descripcionPuesto}</Text>
    </TouchableOpacity>
  );

  
  const handleCreatePuesto = async () => {
    if (!nombrePuesto || !descripcionPuesto) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }
  
    const result = await createPuesto(nombrePuesto, descripcionPuesto); 
    if (result.success) {
      Alert.alert('Éxito', 'Puesto creado correctamente');
      setNombrePuesto('');  
      setDescripcionPuesto('');  
      fetchPuestos();  
    } else {
      Alert.alert('Error', 'No se pudo crear el puesto');
    }
  };


  const handleDeactivatePuesto = async () => {
    if (!nombrePuestoDesactivar) {
      Alert.alert('Error', 'Por favor ingrese el nombre del puesto a desactivar');
      return;
    }
  
    const token = await AsyncStorage.getItem('authToken');  
    if (!token) {
      Alert.alert('Error', 'No se ha encontrado el token');
      return;
    }
  
    // Aquí se realiza la desactivación del puesto
    const result = await deactivatePuesto(token, nombrePuestoDesactivar); 
    if (result.success) {
      Alert.alert('Éxito', 'Puesto desactivado correctamente');
      setNombrePuestoDesactivar(''); 
      fetchPuestos();
    } else {
      Alert.alert('Error', 'No se pudo desactivar el puesto');
    }
  };
  


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#013a63" />
      </View>
    );
  }


  if (error) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Puestos</Text>

      {/* Formulario para crear un puesto */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del puesto"
          value={nombrePuesto}
          onChangeText={setNombrePuesto}
        />
        <TextInput
          style={styles.input}
          placeholder="Descripción del puesto"
          value={descripcionPuesto}
          onChangeText={setDescripcionPuesto}
        />
        <Button title="Crear Puesto" onPress={handleCreatePuesto} />
      </View>

      {/* Formulario para desactivar un puesto */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del puesto a desactivar"
          value={nombrePuestoDesactivar}
          onChangeText={setNombrePuestoDesactivar}
        />
        <Button title="Desactivar Puesto" onPress={handleDeactivatePuesto} />
      </View>

      <Text style={styles.listTitle}>Lista de Puestos Activos</Text>

      {/* Lista de puestos */}
      <FlatList
        data={puestos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPuesto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#e8f4f8', 
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#013a63',
      marginBottom: 16,
    },
    formContainer: {
      marginVertical: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    listTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
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
      fontSize: 18,
      fontWeight: 'bold',
      color: '#013a63',
    },
    itemDescription: {
      fontSize: 16,
      color: '#666',
      marginTop: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      padding: 20,
      backgroundColor: 'lightcoral',
    },
    errorText: {
      color: 'white',
    },
  });
  

export default ViewPuestosAdmin;
