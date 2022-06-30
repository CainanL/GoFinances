import React from 'react'
import { render } from '@testing-library/react-native';

import { Input } from '.';


describe('Input Component', () => {

    it('must have specifc border when active', () => {
        const { getByTestId } = render(
            <Input
                testID='input-email'
                placeholder='e-mail'
                keyboardType='email-address'
                autoCorrect={false}
                activity={true}
            />
        );

        const inputComponent = getByTestId('input-email');

        expect(inputComponent.props.style[0].borderColor).toEqual('#E83F5B')
    });
})
