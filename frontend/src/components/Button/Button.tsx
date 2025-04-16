import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { DynamicIcon } from "lucide-react/dynamic";
import { Col, Spin } from "antd";

type Props = {
    title: string;
    onPress?: () => void;
    disabled?: boolean;
    primary?: boolean;
    icon?: string | React.ReactNode | undefined;
    className?: string;
};

const ButtonComp: FC<Props> = ({
    title,
    onPress,
    disabled,
    primary,
    icon,
    className,
}) => {
    return (
        <ButtonContainer
            disabled={disabled}
            onClick={onPress}
            $primary={primary}
            className={className}
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
    justify-content: center;
    gap: 10px;
    background-color: ${(props) =>
        props.$primary ? Colors.mainBlue : Colors.transparent};
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: 0.3s;

    &:disabled {
        opacity: 0.4;
    }
`;
