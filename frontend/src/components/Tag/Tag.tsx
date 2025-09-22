import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";

export type TagType = 'experience' | 'employment' | 'workFormat' | 'category' | 'skill' | 'default';

interface TagProps {
    text: string;
    isConstant?: boolean; // optional prop
    backColor?: string;
    color?: string;
    tagType?: TagType; // new prop for consistent coloring
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

function getTagTypeColors(tagType: TagType): { background: string; text: string } {
    const tagColors: Record<TagType, { background: string; text: string }> = {
        experience: {
            background: 'hsl(120, 70%, 90%)', // Green tones
            text: 'hsl(120, 70%, 30%)',
        },
        employment: {
            background: 'hsl(210, 70%, 90%)', // Blue tones
            text: 'hsl(210, 70%, 30%)',
        },
        workFormat: {
            background: 'hsl(280, 70%, 90%)', // Purple tones
            text: 'hsl(280, 70%, 30%)',
        },
        category: {
            background: 'hsl(30, 70%, 90%)', // Orange tones
            text: 'hsl(30, 70%, 30%)',
        },
        skill: {
            background: 'hsl(180, 70%, 90%)', // Cyan tones
            text: 'hsl(180, 70%, 30%)',
        },
        default: {
            background: 'hsl(0, 0%, 90%)', // Gray tones
            text: 'hsl(0, 0%, 30%)',
        },
    };
    
    return tagColors[tagType] || tagColors.default;
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

export function Tag({ text, isConstant = false, backColor, color, tagType }: TagProps) {
    const [colors, setColors] = useState<{
        background: string;
        text: string;
    } | null>(null);

    useEffect(() => {
        if (tagType) {
            // Use consistent colors based on tag type
            const typeColors = getTagTypeColors(tagType);
            setColors(typeColors);
        } else if (!isConstant) {
            // Use random colors for backward compatibility
            const generatedColors = generateRandomPastelColor();
            setColors(generatedColors);
        } else {
            // Use constant colors
            setColors({
                background: Colors.light,
                text: Colors.lightGray,
            });
        }
    }, [isConstant, tagType]);

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
