import React, { FC } from "react";
import styled from "styled-components";

type Props = {
    imageUrl?: string;
    size?: number;
};

const Avatar: FC<Props> = ({ imageUrl, size = 50 }) => {
    return (
        <Container
            style={{
                minWidth: size,
                minHeight: size,
                maxWidth: size,
                maxHeight: size,
            }}
        >
            <img
                src={
                    imageUrl
                        ? imageUrl
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="Avatar"
            />
        </Container>
    );
};

export default Avatar;

const Container = styled.div`
    border-radius: 50%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
