import React from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';

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
    TransactionList
} from './styles';

export interface DataListProps extends TransactionCadProps {
    id: string;
};

export function Dashboard() {

    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: 'Desenvolvimento de site',
            amount: 'R$ 12.000',
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: "13/04/2022"
        },
        {
            id: '2',
            type: 'negative',
            title: 'Lanche na padaria',
            amount: 'R$ 1.000',
            category: {
                name: 'Alimentação',
                icon: 'coffee'
            },
            date: "13/04/2022"
        },
        {
            id: '3',
            type: 'positive',
            title: 'Desenvolvimento de site',
            amount: 'R$ 12.000',
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: "13/04/2022"
        },
        {
            id: '4',
            type: 'negative',
            title: 'Compras',
            amount: 'R$ 2.000',
            category: {
                name: 'Aluguél do apartamento',
                icon: 'showpping-bag'
            },
            date: "13/04/2022"
        }
    ]

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/45081471?v=4' }} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Cainan</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>

            </Header>

            <HighlightCards>
                <HighlightCard type='up' title='Entrada' amount='R$ 17.400,00' lastTransaction='Ultima entrada dia 23 de abril' />
                <HighlightCard type='down' title='Saída' amount='R$ 17.400,00' lastTransaction='Ultima saída dia 23 de abril' />
                <HighlightCard type='total' title='Total' amount='R$ 0,00' lastTransaction='Ultima entrada dia 23 de abril' />
            </HighlightCards>

            <Transactions>
                <>
                <Title>Listagem</Title>

                <TransactionList 
                    data={data}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item})=> <TransactionCad data={item} />}                    
                />
                </>
            </Transactions>
        </Container>
    );
};