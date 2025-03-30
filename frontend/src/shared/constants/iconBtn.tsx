import React, { FC } from "react";
import styled from "styled-components";

type Props = {
    icon: React.ReactNode;
    onClick?: () => void;
};

const IconComp: FC<Props> = ({ icon, onClick }) => {
    return <IconContainer onClick={onClick}>{icon}</IconContainer>;
};

export default IconComp;

const IconContainer = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    transition: 0.3s;
    &:hover {
        transform: scale(1.1);
    }
`;
