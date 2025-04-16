import React, { useCallback } from "react";
import JobCard from "../JobCardWithMoreInfo/JobCardWithMoreInfo";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";

const FeaturesJobs = () => {
    const { vacanciesStore } = useRootStore();
    const navigation = useNavigate();

    const renderJobs = useCallback(() => {
        if (!vacanciesStore.vacancies?.vacancies?.length) return null;
        return vacanciesStore.vacancies.vacancies
            .slice(0, 8)
            .map((job, index) => {
                return (
                    <JobCard
                        key={index}
                        title={job.title}
                        creator={job.creator}
                        company={job.company.name}
                        category={job.category}
                        subcategory={job.subcategory}
                        salary={job.salary}
                        employmentType={job.employmentType}
                        workType={job.workType}
                        isFeatured={job.isFeatured}
                        views={job.views}
                        timestamps={job.timestamps}
                        description={job.description}
                        onPress={() =>
                            vacanciesStore.getVacancyById(job._id, () =>
                                navigation(`/vacancy/${job._id}`)
                            )
                        }
                    />
                );
            });
    }, [navigation, vacanciesStore]);

    return (
        <FeaturesJobsContainer>
            <div className="top">
                <div className="title">
                    <Text
                        text="Featured"
                        textSize="thirtySix"
                        color={Colors.textBlack}
                        family="ClashDisplay-Semibold"
                    />
                    <Text
                        text="jobs"
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
            <ButtonComp
                className="seeAllMobile"
                title="See all jobs"
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
