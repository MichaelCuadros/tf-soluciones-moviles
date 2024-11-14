import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { registerUser } from './services/auth';

const ViewRegister = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    rol: 1,
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const result = await registerUser(formData);
    if (result.success) {
      Alert.alert('Success', result.message);
      setFormData({
        usuario: '',
        password: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: '',
        rol: 1,
      });
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={formData.usuario}
        onChangeText={(value) => handleChange('usuario', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nombres"
        value={formData.nombres}
        onChangeText={(value) => handleChange('nombres', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellidos"
        value={formData.apellidos}
        onChangeText={(value) => handleChange('apellidos', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefono"
        keyboardType="phone-pad"
        value={formData.telefono}
        onChangeText={(value) => handleChange('telefono', value)}
      />
      <Button title="Register" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#e8f4f8', // Fondo azul claro
  },
  title: {
    fontSize: 28, // Tamaño de fuente aumentado
    fontWeight: '700', // Negrita
    marginBottom: 24,
    textAlign: 'center',
    color: '#013a63', // Azul oscuro
  },
  input: {
    height: 40,
    borderColor: '#fbb034', // Bordes amarillos
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8, // Bordes más redondeados
    backgroundColor: '#fff', // Fondo blanco para el input
    fontSize: 16, // Tamaño de fuente más grande
  },
});


export default ViewRegister;
