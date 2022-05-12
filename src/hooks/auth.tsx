import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

import * as AuthSession from 'expo-auth-session';//authenticador google
import * as AppleAuthentication from 'expo-apple-authentication';//authenticador apple

interface AuthProviderProps {
    children: ReactNode;
};

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
};

interface AuthContextData {
    user: User;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    userStoragedLoading: boolean;
};

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string;
}

const AuthContext = createContext({} as AuthContextData);//cria o contexto com o valor inicial = []

function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<User>({} as User);
    const [userStoragedLoading, setUserStoragedLoading] = useState(true);

    const userStorageKey = '@gofinances:user'


    //função de autenticação com o google
    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

            if (type == 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);//pega as informações do usuário na api do google
                const userInfo = await response.json();

                setUser({
                    email: userInfo.email,
                    id: userInfo.id,
                    name: userInfo.name,
                    photo: userInfo.picture
                });

                await AsyncStorage.setItem(userStorageKey, JSON.stringify({
                    email: userInfo.email,
                    id: userInfo.id,
                    name: userInfo.name,
                    photo: userInfo.picture
                }));

            };
        } catch (error) {
            throw new Error(error);
        }
    }

    //função de autenticação com a apple
    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            });

            if (credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1` 
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo
                };

                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
            };


        } catch (error) {
            throw new Error(error);
        }
    }

    //função de logOut
    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    };



    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem(userStorageKey);

            if (userStoraged) {
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }

            setUserStoragedLoading(false);
        }

        loadUserStorageData();
    }, [])

    /* Coloca o contexto e acessa o provider dele, poi ele é um objeto, o value recebe o valor atual. */
    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStoragedLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);
    return context;
};

export { AuthProvider, useAuth };