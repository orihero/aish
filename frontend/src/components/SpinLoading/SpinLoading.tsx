import { Spin } from "antd";
import React, { FC } from "react";
import styled from "styled-components";

type Props = {
    size?: "small" | "large";
    height?: string;
};

const SpinLoading: FC<Props> = ({ size = "small", height }) => {
    return (
        <SpinContainer style={{ height: height || "10vh" }}>
            <Spin size={size} />
        </SpinContainer>
    );
};

export default SpinLoading;

const SpinContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
