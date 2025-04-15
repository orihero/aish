import React, { useCallback } from "react";
import CategoryCard from "../CategoryCard/CategoryCard";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const { categoriesStore } = useRootStore();
    const navigation = useNavigate();

    const renderCategories = useCallback(() => {
        if (!categoriesStore.enrichedCategories?.length) return null;
        return categoriesStore.enrichedCategories
            .slice(0, 8)
            .map((category, index) => {
                return (
                    <CategoryCard
                        key={index}
                        title={category.title[0].value as never}
                        icon={category.icon}
                        vacancies={`${category.jobCount} jobs available`}
                    />
                );
            });
    }, [categoriesStore.enrichedCategories]);

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
                    className="seeAll"
                    title="See all jobs"
                    icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                    onPress={() => navigation("/vacancies")}
                />
            </div>
            <div className="cards">{renderCategories()}</div>
            <ButtonComp
                className="seeAllMobile"
                title="See all jobs"
                icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                onPress={() => navigation("/vacancies")}
            />
        </CategoriesContainer>
    );
};

export default observer(Categories);

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

    .seeAllMobile {
        display: none;
    }

    .seeAll {
        display: flex;
        align-items: center;
    }

    @media (max-width: 768px) {
        .cards {
            grid-template-columns: repeat(1, 1fr);
        }
        .seeAllMobile {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        .seeAll {
            display: none;
        }
    }
`;
