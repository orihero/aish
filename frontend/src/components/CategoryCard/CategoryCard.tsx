import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { FiArrowRight } from "react-icons/fi";
import { DynamicIcon } from "lucide-react/dynamic";
import { toKebabCase } from "../../shared/helper/replicate";

type Props = {
    icon?: string;
    title: string;
    vacancies: string;
    categoryId?: string;
    onCategoryClick?: (categoryId: string, title: string) => void;
};

const CategoryCard: FC<Props> = ({ icon, title, vacancies, categoryId, onCategoryClick }) => {
    const handleClick = () => {
        if (categoryId && onCategoryClick) {
            onCategoryClick(categoryId, title);
        }
    };

    return (
        <CategoryCardContainer onClick={handleClick}>
            <div className="white icon">
                <DynamicIcon
                    name={toKebabCase(icon || "") as never}
                    size={48}
                />
            </div>
            <Text
                text={title}
                textSize="eighteen"
                color={Colors.black}
                className="white"
            />
            <div className="arrowRight">
                <Text
                    text={vacancies}
                    textSize="fourteen"
                    color={Colors.textGray}
                    className="white"
                    family="Epilogue-Regular"
                />
                <FiArrowRight
                    size={20}
                    color={Colors.textGray}
                    className="white"
                />
            </div>
        </CategoryCardContainer>
    );
};

export default CategoryCard;

const CategoryCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    border: 1px solid ${Colors.lineColor};
    padding: 30px;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;

    .icon {
        font-size: 40px;
        color: ${Colors.mainBlue};
    }

    .arrowRight {
        display: flex;
        align-items: center;
        gap: 10px;
        transition: color 0.3s ease;
    }

    &:hover {
        background-color: ${Colors.mainBlue}; /* Card hover bo'lganda background blue */

        .white {
            color: ${Colors.white} !important; /* Text hover bo'lganda white */
        }

        .arrowRight {
            color: ${Colors.white}; /* Icon va text oq rangga o'tadi */

            svg {
                color: ${Colors.white}; /* FiArrowRight icon rangi oq */
            }
        }
    }
`;
