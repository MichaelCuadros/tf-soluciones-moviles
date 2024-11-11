import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { obtenerPuestos } from './services/Puestos';  // Importamos la función para obtener los puestos

const ViewPuestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPuesto, setSelectedPuesto] = useState(null);  // Estado para el puesto seleccionado

  useEffect(() => {
    const cargarPuestos = async () => {
      setLoading(true);
      const result = await obtenerPuestos();
      if (result.success) {
        setPuestos(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
      setLoading(false);
    };

    cargarPuestos();
  }, []);

  const handleSelectPuesto = (puestoIndex) => {
    setSelectedPuesto(puestoIndex);  // Actualizamos el índice del puesto seleccionado
    
  };

  const renderPuesto = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedPuesto === index && styles.selectedItem,  // Verificamos si el índice coincide con el puesto seleccionado
      ]}
      onPress={() => handleSelectPuesto(index)}  // Usamos el índice para seleccionar el puesto
    >
      <Text style={styles.itemTitle}>{item.nombrePuesto}</Text>
      <Text style={styles.itemDescription}>{item.descripcionPuesto}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Puestos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#841584" />
      ) : (
        <FlatList
          data={puestos}
          keyExtractor={(item, index) => index.toString()}  // Usamos el índice como clave única
          renderItem={renderPuesto}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {selectedPuesto !== null && (
        <Text style={styles.selectedText}>Puesto seleccionado: {puestos[selectedPuesto].nombrePuesto}</Text>  // Mostrar el nombre del puesto seleccionado
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  selectedItem: {
    backgroundColor: 'black',  // parte seleccionada
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#841584',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default ViewPuestos;
