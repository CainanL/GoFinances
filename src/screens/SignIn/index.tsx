import React, { useContext, useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator, Alert, Platform } from 'react-native';

import { useTheme } from 'styled-components';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles'

import { SignInSocialButton } from '../../Components/SignInSocialButton';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';

export function SignIn() {

    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();

    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle(); //o return serve para seguir o fluxo e não dar problema de performace por conta do finaly
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Google');
            setIsLoading(false);
        };
    };

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple(); //o return serve para seguir o fluxo e não dar problema de performace por conta do finaly
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível conectar a conta Apple');
            setIsLoading(false);
        };
    };

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma {'\n'}
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>

                <Footer>
                    <FooterWrapper>
                        <SignInSocialButton
                            title='Entrar com o google'
                            svg={GoogleSvg}
                            onPress={handleSignInWithGoogle}
                        />

                        {
                            Platform.OS === 'ios' &&
                            <SignInSocialButton
                                title='Entrar com apple'
                                svg={AppleSvg}
                                onPress={handleSignInWithApple}
                            />
                        }


                        {isLoading &&
                            <ActivityIndicator
                                color={theme.colors.shape}
                                style={{ marginTop: RFValue(18) }}
                            />
                        }
                    </FooterWrapper>
                </Footer>
            </Header>
        </Container>
    )
}