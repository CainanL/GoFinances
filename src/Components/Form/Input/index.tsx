import React from 'react';
import { TextInputProps } from 'react-native';

import { Container } from './styles';

interface Props extends TextInputProps {
    activity?: boolean;
};

export function Input({
    activity = false,
    ...rest
}: Props) {
    return (
        <Container
            active={activity}
            {...rest}
        />
    )
}