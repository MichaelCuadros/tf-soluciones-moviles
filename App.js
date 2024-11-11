import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ViewLogin from './src/auth/ViewLogin';
import ViewRegister from './src/auth/ViewRegister';
import ViewHome from './src/home/ViewHome';
import ViewCuestionarios from './src/cuestionarios/ViewCuestionarios'; // Importa ViewCuestionarios
import ViewPuestos from './src/puestos/ViewPuestos';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={ViewLogin} />
        <Stack.Screen name="Register" component={ViewRegister} />
        <Stack.Screen name="Home" component={ViewHome} />
        <Stack.Screen name="Cuestionarios" component={ViewCuestionarios} />
        <Stack.Screen name="PuestosTrabajo" component={ViewPuestos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
