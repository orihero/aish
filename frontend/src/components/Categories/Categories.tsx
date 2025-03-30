import React, { useCallback } from "react";
import { CategoriesData } from "../../shared/constants/exampleData";
import CategoryCard from "../CategoryCard/CategoryCard";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";

const Categories = () => {
    const renderCategories = useCallback(() => {
        return CategoriesData.map((category, index) => {
            return (
                <CategoryCard
                    key={index}
                    title={category.title}
                    icon={category.icon}
                    vacancies={category.vacancies}
                />
            );
        });
    }, []);

    return (
        <CategoriesContainer>
            <div className="top">
                <div className="title">
                    <Text
                        text="Explore by"
                        textSize="thirtySix"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text="category"
                        textSize="thirtySix"
                        color={Colors.secondBlue}
                        family="ClashDisplay-Semibold"
                    />
                </div>
                <ButtonComp
                    title="See all jobs"
                    icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                />
            </div>
            <div className="cards">{renderCategories()}</div>
        </CategoriesContainer>
    );
};

export default Categories;

const CategoriesContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 50px 5%;
    gap: 30px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 5px;
    }
`;
