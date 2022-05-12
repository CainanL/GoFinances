import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subMonths, addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { VictoryPie } from 'victory-native';
import { useFocusEffect } from '@react-navigation/native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';//para pegar a altura do elemento
import { useTheme } from 'styled-components';

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
} from './styles';
import { categories } from '../../utils/categories';
import { HistoryCard } from '../../Components/HistoryCard';
import { RFValue } from 'react-native-responsive-fontsize';
import { useAuth } from '../../hooks/auth';

export interface TransactionData {
    id: string;
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
};

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    const {user} = useAuth();

    const theme = useTheme();

    function handleChangeDate(action: 'next' | 'prev') {
        if (action === 'next') {
            const newDate = addMonths(selectedDate, 1)// pega o mes da data e adiciona mais um
            setSelectedDate(newDate)
        } else {
            const newDate = subMonths(selectedDate, 1)// pega o mes da data e adiciona mais um
            setSelectedDate(newDate)
        };
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response!) : [];

        const expensives = responseFormatted
            .filter((expensive: TransactionData) =>
                expensive.type === 'negative' &&
                new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
                new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
            );

        const expensivesTotal = expensives.reduce((
            acumullator: number,
            expensive: TransactionData) => {
            return acumullator + Number(expensive.amount)
        }, 0);

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                };
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    color: category.color,
                    totalFormatted,
                    percent
                });
            };
        });

        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    };

    useFocusEffect(useCallback(()=>{
        loadData();
    },[]))

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer> :

                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight()
                        }}
                    >

                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleChangeDate('prev')}>
                                <MonthSelectIcon name='chevron-left' />
                            </MonthSelectButton>

                            <Month>
                                {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
                            </Month>

                            <MonthSelectButton onPress={() => handleChangeDate('next')}>
                                <MonthSelectIcon name='chevron-right' />
                            </MonthSelectButton>
                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {
                                        fontSize: RFValue(18),
                                        fontWeight: 'bold',
                                        fill: theme.colors.shape
                                    }
                                }}
                                labelRadius={50}
                                x="percent"
                                y="total"
                            />
                        </ChartContainer>

                        {
                            totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }


                    </Content>
            }
        </Container>
    )
}