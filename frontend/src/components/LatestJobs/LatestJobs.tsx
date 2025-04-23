import React, { useCallback } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";
import ShortJobCard from "../ShortInfoJobCard/ShortInfoJobCard";
import { Images } from "../../shared/assets";
import useRootStore from "../../shared/hooks/UseRootStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

const LatestJobs = () => {
    const { vacanciesStore } = useRootStore();
    const navigation = useNavigate();

    const handleGetVacancy = useCallback(
        (id: string) => {
            navigation(`/vacancy/${id}`);
            vacanciesStore.findVacancyById(id, "lates", () =>
                vacanciesStore.getVacancyById(id)
            );
        },
        [navigation, vacanciesStore]
    );

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies?.vacancies
            .slice(0, 10)
            ?.map((job, index) => {
                return (
                    <ShortJobCard
                        key={index}
                        vacancy={job}
                        onPress={() => handleGetVacancy(job._id)}
                    />
                );
            });
    }, [handleGetVacancy, vacanciesStore.vacancies?.vacancies]);

    return (
        <LatestJobsContainer>
            <div className="top">
                <div className="title">
                    <Text
                        text="Latest"
                        textSize="thirtySix"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text="jobs open"
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
            <div className="cards">{renderJobs()}</div>
            <img className="pattern" src={Images.walcomePatter} alt="pattern" />
            <ButtonComp
                className="seeAllMobile"
                title="See all jobs"
                icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                onPress={() => navigation("/vacancies")}
            />
        </LatestJobsContainer>
    );
};

export default observer(LatestJobs);

const LatestJobsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 60px 5%;
    gap: 30px;
    background-image: url(${Images.jobsBack});
    position: relative;
    min-height: 60vh;

    .pattern {
        position: absolute;
        top: 0;
        right: 0;
        width: 40%;
        z-index: 0;
        height: 100%;
        object-fit: cover;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 1;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        z-index: 1;
    }

    .seeAllMobile {
        display: none;
    }

    .seeAll {
        display: flex;
        align-items: center;
    }

    @media (max-width: 992px) {
        .cards {
            grid-template-columns: repeat(1, 1fr);
        }
        .seeAllMobile {
            display: flex;
            align-items: center;
            margin-top: 20px;
        }
        .seeAll {
            display: none;
        }
    }
`;
