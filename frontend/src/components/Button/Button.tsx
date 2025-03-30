import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";

type Props = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    primary?: boolean;
    icon?: string | React.ReactNode | undefined;
};

const ButtonComp: FC<Props> = ({ title, onPress, disabled, primary, icon }) => {
    return (
        <ButtonContainer
            disabled={disabled}
            onClick={onPress}
            $primary={primary}
        >
            <Text
                text={title}
                textSize="fourteen"
                color={primary ? Colors.white : Colors.mainBlue}
                family="Epilogue-Bold"
            />
            {icon && icon}
        </ButtonContainer>
    );
};

export default ButtonComp;

const ButtonContainer = styled.button<{ $primary?: boolean }>`
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: ${(props) =>
        props.$primary ? Colors.mainBlue : Colors.transparent};
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;
`;
