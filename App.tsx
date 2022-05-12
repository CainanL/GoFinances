
import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import 'intl';//para utilizar o intl dentro do android pois não vem nativo
import 'intl/locale-data/jsonp/pt-BR';//para trabalhar com o locale-date em pt-BR pois não vem nativo no android
import { StatusBar } from 'react-native';

import { useAuth } from './src/hooks/auth';

import theme from './src/global/styles/theme';

import { Routes } from './src/routes';
import { AppRoutes } from './src/routes/app.routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SignIn } from './src/screens/SignIn';
import { AuthProvider } from './src/hooks/auth';

export default function App() {

  const [fontsLoading] = useFonts({ //o primeiro elemento do array fala se as fontes já foram carregadas ou não
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStoragedLoading } = useAuth();

  if (!fontsLoading || userStoragedLoading) {
    return <AppLoading />
    {/* Se a aplicação estiver carregando ela retorna o loading e não quebra por conta dos outros dados em memoria */ }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 } /* Para resolver os problemas de botões não clicaveis */}>
      <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

