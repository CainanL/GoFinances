import React from 'react';

import { render } from '@testing-library/react-native'; //cria uma renderização da interface sem precisar passar pelo emulador

import { Profile } from '../../screens/Profile';//importação da tela react que será testada

//função de agrupamento de teste, 
//recebe o nome do agrupamento e a função com todos os testes a serem execultados
describe('Profile screen', () => {

    /**
 * 1º parametro - nome do teste, use nomes faceis de indentificar qual teste é cada um
 * 2º parametro - função que vai execultar alguma coisa
 */
    it('should have placeholder correctly in user name input', () => {
        const {
            debug,
            getByPlaceholderText
        } = render(<Profile />);

        // debug(); //da um console.log no componente
        const inputName = getByPlaceholderText('Nome')//pega o input que tem o placeholder 'Nome'
        //função que analizar e informa o que deve ser esperado
        expect(inputName.props.placeholder).toBeTruthy()
    });

    it('should be load user data', () => {
        const {
            getByTestId//consigo pegar exatamente um determinado elemento que esteja renderizado em tela
        } = render(<Profile />);

        const inputName = getByTestId('input-name');
        const inputSurname = getByTestId('input-surname');

        expect(inputName.props.value).toEqual('Cainan');//verifica se o que está dentro do valor do input é igual ao valor passado para o toEqual
        expect(inputSurname.props.value).toEqual('Luyles');
    });

    it('should exist title', () => {
        const { getByTestId } = render(<Profile />);

        const textTitle = getByTestId('text-title');

        expect(textTitle.props.children).toContain('Perfil')
    });


});

