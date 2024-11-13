import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { obtenerPuestos } from './services/Puestos';

const ViewPuestos = ({ navigation }) => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSelectPuesto = (puesto) => {
    // Navegar a Cuestionario y pasar el puesto seleccionado como parámetro
    navigation.navigate('Cuestionarios', { puestoTrabajo: puesto });
  };

  const renderPuesto = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectPuesto(item)}  // Pasar el puesto completo
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
          keyExtractor={(item, index) => index.toString()}
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
});

export default ViewPuestos;
