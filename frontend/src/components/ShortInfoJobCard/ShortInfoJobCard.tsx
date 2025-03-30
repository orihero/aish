import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { Images } from "../../shared/assets";

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
    Design: Colors.mainBlue,
    DesignBack: Colors.mainBlueLight,
    Business: Colors.mainBlue,
    BusinessBack: Colors.mainBlueLight,
    Technology: Colors.tomato,
    TechnologyBack: Colors.lightTomato,
};

const ShortJobCard: FC<Props> = ({
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
            <Logo src={logo} alt={companyName} />
            <Content>
                <JobTitle>
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
                </JobTitle>
                <Text
                    text={description}
                    textSize="twelve"
                    color={Colors.textGray}
                    family="Epilogue-Regular"
                    lineHeight={18}
                />
                <Tags>
                    <Tag
                        style={{
                            color: Colors.green,
                            backgroundColor: Colors.lightGreen,
                        }}
                    >
                        {jobType}
                    </Tag>
                    <img src={Images.divider} height={20} alt="" />
                    {jobTags.map((tag, index) => (
                        <Tag
                            key={index}
                            style={{
                                color: tagColors[tag] || Colors.green,
                                backgroundColor:
                                    tagColors[`${tag}Back`] ||
                                    Colors.lightGreen,
                            }}
                        >
                            {tag}
                        </Tag>
                    ))}
                </Tags>
            </Content>
        </JobCardContainer>
    );
};

export default ShortJobCard;

const JobCardContainer = styled.div`
    display: flex;
    gap: 15px;
    padding: 20px;
    background: white;
`;

const Logo = styled.img`
    width: 40px;
    height: 40px;
    object-fit: contain;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const JobTitle = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const Tags = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const Tag = styled.span`
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 12px;
`;
