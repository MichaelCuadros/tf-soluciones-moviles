import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { getPuestosInactivos, activatePuesto } from './services/PuestoInacAdmin';

const ViewPuestosInacAdmin = () => {
  const [puestosInactivos, setPuestosInactivos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPuestosInactivos = async () => {
      const result = await getPuestosInactivos();
      if (result.success) {
        setPuestosInactivos(result.data);
      } else {
        setError(result.message);
      }
    };

    fetchPuestosInactivos();
  }, []);

  const handleActivatePuesto = async (puesto) => {
    const result = await activatePuesto(puesto);
    if (result.success) {
      alert('Puesto activado exitosamente');
      // Vuelve a obtener la lista de puestos inactivos después de la activación
      const result = await getPuestosInactivos();
      setPuestosInactivos(result.data);
    } else {
      setError(result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puestos Inactivos</Text>
      {error && <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>}
      
      <ScrollView contentContainerStyle={styles.formContainer}>
        {puestosInactivos.map((puesto, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemTitle}>{puesto.nombrePuesto}</Text>
            <Text style={styles.itemDescription}>{puesto.descripcionPuesto}</Text>
            <Button
              title="Activar"
              onPress={() => handleActivatePuesto(puesto.nombrePuesto)}
              color="#fbb034"
            />
          </View>
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
    paddingBottom: 20, // Añadido para espacio en la parte inferior al hacer scroll
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
  errorContainer: {
    padding: 20,
    backgroundColor: 'lightcoral',
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'white',
  },
});

export default ViewPuestosInacAdmin;
