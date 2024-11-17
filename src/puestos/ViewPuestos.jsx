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
    navigation.navigate('Cuestionarios', { puestoTrabajo: puesto });
  };

  const renderPuesto = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectPuesto(item)}
    >
      <Text style={styles.itemTitle}>{item.nombrePuesto}</Text>
      <Text style={styles.itemDescription}>{item.descripcionPuesto}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Puestos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#013a63" />
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
});

export default ViewPuestos;
