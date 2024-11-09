import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { obtenerCuestionarios } from './services/cuestionarios';

const ViewCuestionarios = () => {
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCuestionarios = async () => {
      setLoading(true);
      const result = await obtenerCuestionarios();
      if (result.success) {
        setCuestionarios(result.data);
      } else {
        Alert.alert('Error', result.message);
      }
      setLoading(false);
    };

    cargarCuestionarios();
  }, []);

  const renderRespuesta = (respuestas) => (
    <View style={styles.respuestaContainer}>
      {respuestas.map((respuesta, index) => (
        <Text key={index} style={styles.respuestaText}>
          {index + 1}. {respuesta.respuestaDescripcion}
        </Text>
      ))}
    </View>
  );

  const renderCuestionario = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.pregunta}</Text>
      <Text style={styles.itemDescription}>{item.preguntaDescripcion}</Text>
      {renderRespuesta(item.respuesta)}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Cuestionarios</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#841584" />
      ) : (
        <FlatList
          data={cuestionarios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCuestionario}
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
    marginBottom: 8,
  },
  respuestaContainer: {
    marginTop: 8,
  },
  respuestaText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ViewCuestionarios;
