import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { obtenerCuestionarios, registrarCuestionario } from './services/cuestionarios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewCuestionarios = ({ route }) => {
  const { puestoTrabajo } = route.params; // Recibir el puestoTrabajo desde la navegación
  const [cuestionarios, setCuestionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('usuario');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage', error);
      }
    };

    fetchUser();
  }, []);

  const handleSelectAnswer = (questionId, nroRespuesta) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: nroRespuesta });
  };

  const renderRespuesta = (respuestas, questionId) => (
    <View style={styles.respuestaContainer}>
      {respuestas.map((respuesta) => (
        <TouchableOpacity
          key={respuesta.nroRespuesta}
          style={[
            styles.respuestaButton,
            selectedAnswers[questionId] === respuesta.nroRespuesta && styles.selectedButton,
          ]}
          onPress={() => handleSelectAnswer(questionId, respuesta.nroRespuesta)}
        >
          <Text style={styles.respuestaText}>{respuesta.respuestaDescripcion}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCuestionario = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.pregunta}</Text>
      <Text style={styles.itemDescription}>{item.preguntaDescripcion}</Text>
      {renderRespuesta(item.respuesta, item.id)}
    </View>
  );

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no encontrado');
      return;
    }
  
    if (!puestoTrabajo || !puestoTrabajo.nombrePuesto) {
      Alert.alert('Error', 'Información del puesto de trabajo no encontrada');
      return;
    }
  
    const respuestas = [];
    for (const questionId of Object.keys(selectedAnswers)) {
      const cuestionario = cuestionarios.find((item) => item.id.toString() === questionId);
      if (!cuestionario) {
        console.warn(`Pregunta con id ${questionId} no encontrada en cuestionarios.`);
        continue;
      }
  
      const respuesta = selectedAnswers[questionId];
      if (respuesta === undefined) {
        console.warn(`Respuesta para la pregunta con id ${questionId} no seleccionada.`);
        continue;
      }
  
      const tipoPregunta = cuestionario.id >= 1 && cuestionario.id <= 31 ? 'Puesto' : 'Trabajador';
  
      respuestas.push({
        pregunta: cuestionario.pregunta,
        tipoPregunta,
        respuesta,
      });
    }
  
    if (respuestas.length === 0) {
      Alert.alert('Error', 'No hay respuestas válidas para enviar.');
      return;
    }
  
    const data = {
      usuario: user.name,
      puesto: puestoTrabajo.nombrePuesto,
      respuestas,
    };
  
    console.log("Datos a enviar:", JSON.stringify(data, null, 2));
  
    try {
      const result = await registrarCuestionario(data);
      if (result.success) {
        Alert.alert('Éxito', result.data.resultado || 'Cuestionario registrado correctamente');
      } else {
        Alert.alert('Error', result.message || 'Ocurrió un error al registrar el cuestionario');
      }
    } catch (error) {
      console.error("Error al enviar el cuestionario:", error);
      Alert.alert('Error', 'Error al enviar los datos al servidor');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuestionarios para el puesto: {puestoTrabajo.nombrePuesto}</Text>
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
      <Button title="Enviar Cuestionario" onPress={handleSubmit} color="#841584" />
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
  respuestaButton: {
    backgroundColor: '#555',
    color:'#666',
    padding: 5,
    borderRadius: 5,
    marginVertical: 1,
  },
  selectedButton: {
    backgroundColor: '#841584',
  },
  respuestaText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ViewCuestionarios;
