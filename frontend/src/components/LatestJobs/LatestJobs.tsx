import React from "react";
import JobCard from "../JobCardWithMoreInfo/JobCardWithMoreInfo";
import { jobListings } from "../../shared/constants/exampleData";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import ButtonComp from "../Button/Button";
import { FiArrowRight } from "react-icons/fi";
import ShortJobCard from "../ShortInfoJobCard/ShortInfoJobCard";
import { Images } from "../../shared/assets";

const LatestJobs = () => {
    return (
        <LatestJobsContainer>
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
                    <ShortJobCard
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
            <img className="pattern" src={Images.walcomePatter} alt="pattern" />
        </LatestJobsContainer>
    );
};

export default LatestJobs;

const LatestJobsContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 60px 5%;
    gap: 30px;
    background-image: url(${Images.jobsBack});
    position: relative;

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
        gap: 5px;
    }

    .cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
        z-index: 1;
    }
`;
