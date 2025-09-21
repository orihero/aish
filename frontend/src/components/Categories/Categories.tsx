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
import { useTranslation } from "react-i18next";
import { getTranslatedValue } from "../../shared/utils/translationHelpers";

const Categories = () => {
    const { categoriesStore, visibleStore, vacanciesStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();

    const handleCategoryClick = useCallback((categoryId: string, title: string) => {
        // Set the category filter in vacancies store
        vacanciesStore.setFilter("category", categoryId);
        
        // Navigate to vacancies page
        navigation("/vacancies");
        
        // Trigger vacancy search with the selected category
        vacanciesStore.getVacanciesByQuery(true);
    }, [navigation, vacanciesStore]);

    const renderCategories = useCallback(() => {
        if (!categoriesStore.enrichedCategories?.length) return null;
        return categoriesStore.enrichedCategories
            .slice(0, 8)
            .map((category, index) => {
                const translatedTitle = getTranslatedValue(
                    category.title,
                    visibleStore.currentLang,
                    'en'
                );
                return (
                    <CategoryCard
                        key={index}
                        title={translatedTitle}
                        icon={category.icon}
                        vacancies={`${category.jobCount} jobs available`}
                        categoryId={category._id}
                        onCategoryClick={handleCategoryClick}
                    />
                );
            });
    }, [categoriesStore.enrichedCategories, visibleStore.currentLang, handleCategoryClick]);

    return (
        <CategoriesContainer id="categories">
            <div className="top">
                <div className="title">
                    <Text
                        text={t("exploreBy")}
                        textSize="thirtySix"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text={t("exploreByCategory")}
                        textSize="thirtySix"
                        color={Colors.secondBlue}
                        family="ClashDisplay-Semibold"
                    />
                </div>
                <ButtonComp
                    className="seeAll"
                    title={t("seeAllJobs")}
                    icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                    onPress={() => navigation("/vacancies")}
                />
            </div>
            <div className="cards">{renderCategories()}</div>
            <ButtonComp
                className="seeAllMobile"
                title={t("seeAllJobs")}
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
