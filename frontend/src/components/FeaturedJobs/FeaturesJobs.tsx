import React from "react";
import JobCard from "../JobCardWithMoreInfo/JobCardWithMoreInfo";
import { jobListings } from "../../shared/constants/exampleData";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";

const FeaturesJobs = () => {
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
                    title="See all jobs"
                    icon={<FiArrowRight size={18} color={Colors.mainBlue} />}
                />
            </div>
            <div className="cards">
                {jobListings.map((job, index) => (
                    <JobCard
                        jobTitle={job.position}
                        companyName={job.company}
                        jobTags={job.categories}
                        key={index}
                        jobType={job.jobType}
                        location={job.location}
                        logo={job.logo}
                        description={job.description}
                    />
                ))}
            </div>
        </FeaturesJobsContainer>
    );
};

export default FeaturesJobs;

const FeaturesJobsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 60px 5%;
    gap: 30px;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }
`;
