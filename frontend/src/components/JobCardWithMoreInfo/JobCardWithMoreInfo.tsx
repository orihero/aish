import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";

type Props = {
    jobTitle: string;
    companyName: string;
    location: string;
    jobType: string;
    jobTags: string[];
    logo: string;
    description: string;
};

const tagColors: { [key: string]: string } = {
    Marketing: Colors.yellow,
    MarketingBack: Colors.lightYellow,
    Design: Colors.green,
    DesignBack: Colors.lightGreen,
    Business: Colors.mainBlue,
    BusinessBack: Colors.mainBlueLight,
    Technology: Colors.tomato,
    TechnologyBack: Colors.lightTomato,
};

const JobCard: FC<Props> = ({
    jobTitle,
    companyName,
    location,
    jobType,
    jobTags,
    logo,
    description,
}) => {
    return (
        <JobCardContainer>
            <Header>
                <Logo src={logo} alt={companyName} />
                <JobTypeButton>{jobType}</JobTypeButton>
            </Header>
            <Content>
                <Text
                    text={jobTitle}
                    textSize="sixteen"
                    color={Colors.textBlack}
                />
                <Text
                    text={`${companyName} - ${location}`}
                    textSize="twelve"
                    color={Colors.textGray}
                    family="Epilogue-Regular"
                />
                <Text
                    text={description}
                    textSize="twelve"
                    color={Colors.textGray}
                    margin="10px 0 0 0"
                    family="Epilogue-Regular"
                    lineHeight={18}
                />
            </Content>
            <Tags>
                {jobTags.map((tag, index) => (
                    <Tag
                        key={index}
                        style={{
                            color: tagColors[tag] || Colors.green,
                            backgroundColor:
                                tagColors[`${tag}Back`] || Colors.lightGreen,
                        }}
                    >
                        {tag}
                    </Tag>
                ))}
            </Tags>
        </JobCardContainer>
    );
};

export default JobCard;

const JobCardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    border: 1px solid ${Colors.lineColor};
    background: white;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
`;

const JobTypeButton = styled.button`
    background: transparent;
    border: 1px solid ${Colors.mainBlue};
    color: ${Colors.mainBlue};
    padding: 5px 10px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Tags = styled.div`
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
`;

const Tag = styled.span`
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 12px;
`;
