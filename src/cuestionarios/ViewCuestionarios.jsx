import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Button } from 'react-native';
import { obtenerCuestionarios, registrarCuestionario } from './services/cuestionarios'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewCuestionarios = ({ route }) => {
  const { puestoTrabajo } = route.params; 
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
        const resultadoMensaje = result.data.resultado === "Aprobado"
          ? "Cuestionario finalizado, por favor esté pendiente a siguientes exámenes."
          : "Gracias por completar el cuestionario, lamentablemente no ha llegado al puntaje mínimo";
        
        Alert.alert('Éxito', resultadoMensaje);
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
      <View style={styles.buttonContainer}>
        <Button title="Enviar Cuestionario" onPress={handleSubmit} color="#841584" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e8f4f8', // Fondo azul claro
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#013a63', // Azul oscuro
  },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#fbb034', // Resalta el borde con amarillo
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#013a63', // Azul oscuro
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  respuestaContainer: {
    marginTop: 8,
  },
  respuestaButton: {
    backgroundColor: '#013a63', // Azul oscuro para los botones
    padding: 10,
    borderRadius: 5,
    marginVertical: 4,
  },
  selectedButton: {
    backgroundColor: '#fbb034', // Amarillo para el botón seleccionado
  },
  respuestaText: {
    fontSize: 14,
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});


export default ViewCuestionarios;
