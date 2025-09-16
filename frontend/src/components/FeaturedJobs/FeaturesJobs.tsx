import React, { useCallback } from "react";
import JobCard from "../JobCardWithMoreInfo/JobCardWithMoreInfo";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FeaturesJobs = () => {
    const { vacanciesStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();

    // Load featured vacancies when component mounts
    // useEffect(() => {
    //     vacanciesStore.getFeaturedVacancies();
    // }, [vacanciesStore]);

    const handleGetVacancy = useCallback(
        (id: string) => {
            navigation(`/vacancy/${id}`);
            vacanciesStore.findVacancyById(id, "findJobs", () =>
                vacanciesStore.getVacancyById(id)
            );
        },
        [navigation, vacanciesStore]
    );

    const renderJobs = useCallback(() => {
        if (!vacanciesStore?.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies.vacancies
            .slice(0, 8)
            .map((job, index) => {
                return (
                    <JobCard
                        key={index}
                        vacancy={job}
                        onPress={() => handleGetVacancy(job._id)}
                    />
                );
            });
    }, [handleGetVacancy, vacanciesStore.vacancies.vacancies]);

    return (
        <FeaturesJobsContainer>
            <div className="top">
                <div className="title">
                    <Text
                        text={t("featured")}
                        textSize="thirtySix"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text={t("featuredJobs")}
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
            <div className="cards">{renderJobs()}</div>
            <ButtonComp
                className="seeAllMobile"
                title={t("seeAllJobs")}
                icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                onPress={() => navigation("/vacancies")}
            />
        </FeaturesJobsContainer>
    );
};

export default observer(FeaturesJobs);

const FeaturesJobsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 60px 5%;
    gap: 30px;
    min-height: 60vh;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }

    .seeAllMobile {
        display: none;
    }

    .seeAll {
        display: flex;
        align-items: center;
    }

    @media (max-width: 1200px) {
        .cards {
            display: flex;
            overflow: auto;
            -webkit-scrollbar {
                display: none;
            }
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

    @media (max-width: 992px) {
        padding: 30px 5%;
    }
    @media (max-width: 768px) {
        padding: 20px 5%;
    }
`;
