
import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';
import { Register } from './src/screens/Register';



export default function App() {

  const [fontsLoading] = useFonts({ //o primeiro elemento do array fala se as fontes já foram carregadas ou não
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoading){
    return <AppLoading/>
  }

  return (
    <ThemeProvider theme={theme}>
      <Register />
    </ThemeProvider>

  )
}

