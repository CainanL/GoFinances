import React, { useCallback, useEffect, useState } from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';


import { HighlightCard } from '../../Components/HighlightCard';
import { HighlightCards } from '../../Components/HighlightCard/style';
import { TransactionCad, TransactionCadProps } from '../../Components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCadProps {
    id: string;
};

interface HighlightProps {
    amount: string;
    lastTransaction: string;
};

interface HighlightData {
    entries: HighlightProps;
    expensive: HighlightProps;
    total: HighlightProps
};

function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
) {

    const collectionFilttered = collection
        .filter(transaction => transaction.type === type);

    if (collectionFilttered.length === 0) return 0;


    const lastTransaction = new Date(
        Math.max.apply(Math, collection//pega a ultima transação de entrada feita
            .filter(transaction => transaction.type === type)
            .map(transaction => new Date(transaction.date).getTime())
        )
    );

    return `${lastTransaction.getDay()} de ${lastTransaction.toLocaleString('pr-BR', {
        month: 'long'
    })}`
}

export function Dashboard() {

    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const { signOut, user } = useAuth()

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;//chave do async storage
        const response = await AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

            if (item.type == 'positive') {
                entriesTotal += Number(item.amount);
            } else {
                expensiveTotal += Number(item.amount);
            };

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        });

        setTransactions(transactionFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensive = getLastTransactionDate(transactions, 'negative');
        
        const totalInterval = lastTransactionExpensive === 0
            ? 'Não há transações'
            : `01 a ${lastTransactionExpensive}`

        const total = entriesTotal - expensiveTotal;
        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0
                    ? 'Não há transações'
                    : `Última entrada dia ${lastTransactionEntries}`
            },
            expensive: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensive === 0
                    ? 'Não há transações'
                    : `Última entrada dia ${lastTransactionExpensive}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        })

        setIsLoading(false);
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    useFocusEffect(useCallback(() => {//para que sempre que a tela seja chamada e já esteja carregada execultar essa função, pois como o estado não muda não funciona no useEffect
        loadTransactions();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer>
                    :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo source={{ uri: user.photo }} />
                                    <User>
                                        <UserGreeting>Olá, </UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>
                                <LogoutButton onPress={signOut}>
                                    <Icon name="power" />
                                </LogoutButton>
                            </UserWrapper>

                        </Header>

                        <HighlightCards>
                            <HighlightCard
                                type='up'
                                title='Entrada'
                                amount={highlightData.entries.amount}
                                lastTransaction={`Última entrada dia: ${highlightData.entries.lastTransaction}`}
                            />
                            <HighlightCard
                                type='down'
                                title='Saída'
                                amount={highlightData.expensive.amount}
                                lastTransaction={`Última saída dia: ${highlightData.entries.lastTransaction}`}
                            />
                            <HighlightCard
                                type='total'
                                title='Total'
                                amount={highlightData.total.amount}
                                lastTransaction={highlightData.total.lastTransaction}
                            />
                        </HighlightCards>

                        <Transactions>
                            <>
                                <Title>Listagem</Title>

                                <TransactionList
                                    data={transactions}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={({ item }) => <TransactionCad data={item} />}
                                />
                            </>
                        </Transactions>
                    </>
            }
        </Container>
    );
};