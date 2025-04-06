import React from "react";
import styled from "styled-components";

interface TagProps {
    text: string;
}

interface StyledTagProps {
    $backgroundColor: string;
    $textColor: string;
}

function generateRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return {
        background: `hsl(${hue}, 70%, 90%)`,
        text: `hsl(${hue}, 70%, 30%)`,
    };
}

const StyledTag = styled.span<StyledTagProps>`
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: ${(props) => props.$backgroundColor};
    color: ${(props) => props.$textColor};
`;

export function Tag({ text }: TagProps) {
    const colors = generateRandomPastelColor();

    return (
        <StyledTag
            $backgroundColor={colors.background}
            $textColor={colors.text}
        >
            {text}
        </StyledTag>
    );
}
