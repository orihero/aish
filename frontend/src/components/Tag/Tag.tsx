import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";

interface TagProps {
    text: string;
    isConstant?: boolean; // optional prop
    backColor?: string;
    color?: string;
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
    text-align: center;
`;

export function Tag({ text, isConstant = false, backColor, color }: TagProps) {
    const [colors, setColors] = useState<{
        background: string;
        text: string;
    } | null>(null);

    useEffect(() => {
        if (!isConstant) {
            const generatedColors = generateRandomPastelColor();
            setColors(generatedColors);
        } else {
            setColors({
                background: Colors.light,
                text: Colors.lightGray,
            });
        }
    }, [isConstant]);

    if (!colors) {
        return null;
    }

    return (
        <StyledTag
            $backgroundColor={backColor || colors.background}
            $textColor={color || colors.text}
        >
            {text}
        </StyledTag>
    );
}
