import styled, { css } from "styled-components";
import { TextInput } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { bool } from "yup";

interface Props {
    active: boolean;
}

export const Container = styled(TextInput) <Props>`
    padding: 16px 18px;
    width: 100%;

    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.text_dark};

    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;
    
    margin-bottom: 8px;

    ${({ active, theme }) => active && css`
        border-width: 3px;
        border-color: ${theme.colors.attention};
    `}
`;
