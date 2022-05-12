import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';
import theme from '../global/styles/theme';

const {
    Navigator,
    Screen
} = createBottomTabNavigator();

export function AppRoutes() {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,/* Escone ou mostra o cabeçalho com o nome da tela */
                tabBarActiveTintColor: theme.colors.secondary, /* define a cor do texto e icones da bar quando a tela ta ativa*/
                tabBarInactiveTintColor: theme.colors.text, /* Define a cor do texto e icones da bar quando em outra tela */
                tabBarLabelPosition: 'beside-icon',/* define se os icones vão ficar em cima ou ao lado do texto */
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0
                }
            }}
        >
            <Screen
                name='Listagem'
                component={Dashboard}
                options={{
                    tabBarIcon: (({color, size})=> //o focos e o size vem do Navigator 
                        <MaterialIcons
                            name='format-list-bulleted'
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name='Cadastrar'
                component={Register}
                options={{
                    tabBarIcon: (({color, size})=> //o focos e o size vem do Navigator 
                        <MaterialIcons
                            name='attach-money'
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name='Resumo'
                component={Resume}
                options={{
                    tabBarIcon: (({color, size})=> //o focos e o size vem do Navigator 
                        <MaterialIcons
                            name='pie-chart'
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Navigator>
    )
}