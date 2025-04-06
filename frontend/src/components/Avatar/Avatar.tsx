import React, { FC } from "react";
import styled from "styled-components";

type Props = {
    imageUrl?: string;
};

const Avatar: FC<Props> = ({ imageUrl }) => {
    return (
        <Container>
            <img src={imageUrl} alt="Avatar" />
        </Container>
    );
};

export default Avatar;

const Container = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
