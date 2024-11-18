import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { obtenerPuestos } from '../puestos/services/Puestos';
import { getPostulantesByPuesto } from './services/PostulantexPuesto';

const ViewPostulantesxPuestos = () => {
  const [puestosActivos, setPuestosActivos] = useState([]);
  const [postulantes, setPostulantes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPuestosActivos = async () => {
      try {
        const result = await obtenerPuestos();
        if (result.success) {
          setPuestosActivos(result.data);
        } else {
          setError(result.message || 'Error al cargar los puestos.');
        }
      } catch (err) {
        setError('Error de conexión al cargar los puestos.');
      }
    };

    fetchPuestosActivos();
  }, []);

  const handleGetPostulantes = async (puesto) => {
    setLoading(true);
    setError('');
    try {
      const result = await getPostulantesByPuesto(puesto);
      if (result.success) {
        setPostulantes(result.data || []);
      } else {
        setError(result.message || 'Error al obtener los postulantes.');
        setPostulantes([]);
      }
    } catch (err) {
      setError('Hubo un problema al conectar con la API.');
      setPostulantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPuesto = (puesto) => {
    setSearchText(puesto);
    handleGetPostulantes(puesto);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ver Postulantes por Puesto</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Buscar puesto..."
        editable={!loading}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#013a63" style={{ marginVertical: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.formContainer}>
          {postulantes.length > 0 ? (
            postulantes.map((postulante, index) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemTitle}>{postulante.usuario}</Text>
                <Text style={styles.itemDescription}>{postulante.resultdo}</Text>
                <Text style={styles.itemDescription}>{postulante.email}</Text>
              </View>
            ))
          ) : (
            searchText && <Text>No hay postulantes para este puesto.</Text>
          )}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.formContainer}>
        {puestosActivos.map((puesto, index) => (
          <TouchableOpacity
            key={index}
            style={styles.puestoButton}
            onPress={() => handleSelectPuesto(puesto.nombrePuesto)}
          >
            <Text style={styles.puestoText}>{puesto.nombrePuesto}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#013a63',
  },
  itemDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'lightcoral',
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'white',
  },
  puestoButton: {
    backgroundColor: '#fbb034',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  puestoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default ViewPostulantesxPuestos;
