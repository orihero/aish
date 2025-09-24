import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";

type Props = {
    imageUrl?: string;
    size?: number;
    firstName?: string;
    lastName?: string;
    backgroundColor?: string;
    textColor?: string;
    textSize?: "twentyTwo" | "twentyEight" | 'sixteen';
};

const Avatar: FC<Props> = ({
    imageUrl,
    size = 50,
    firstName,
    lastName,
    backgroundColor,
    textColor,
    textSize,
}) => {
    return (
        <Container
            style={{
                minWidth: size,
                minHeight: size,
                maxWidth: size,
                maxHeight: size,
                backgroundColor: backgroundColor,
            }}
        >
            {imageUrl && (
                <img
                    src={
                        imageUrl
                            ? imageUrl
                            : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="Avatar"
                />
            )}
            {!imageUrl && firstName && lastName && (
                <Text
                    text={`${firstName.slice(0, 1)} ${lastName.slice(0, 1)}`}
                    textSize={textSize ? textSize : "twentyEight"}
                    color={textColor ? textColor : Colors.white}
                />
            )}
        </Container>
    );
};

export default Avatar;

const Container = styled.div`
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
