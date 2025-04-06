import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { CreatorType, SalaryType, translationType } from "../../types";
import Avatar from "../Avatar/Avatar";
import { Tag } from "../Tag/Tag";

type Props = {
    title: string;
    creator: CreatorType;
    company: string;
    category: {
        title: translationType[];
    };
    subcategory: string;
    description: string;
    salary: SalaryType;
    employmentType: string;
    workType: string;
    isFeatured: boolean;
    views: number;
    timestamps: boolean;
    onPress?: () => void;
};

// const tagColors: { [key: string]: string } = {
//     Marketing: Colors.yellow,
//     MarketingBack: Colors.lightYellow,
//     Design: Colors.green,
//     DesignBack: Colors.lightGreen,
//     Business: Colors.mainBlue,
//     BusinessBack: Colors.mainBlueLight,
//     Technology: Colors.tomato,
//     TechnologyBack: Colors.lightTomato,
// };

const JobCard: FC<Props> = ({
    category,
    subcategory,
    title,
    creator,
    company,
    salary,
    employmentType,
    workType,
    isFeatured,
    views,
    timestamps,
    description,
    onPress,
}) => {
    return (
        <JobCardContainer onClick={onPress}>
            <Header>
                <Avatar
                    imageUrl={
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                />
                <JobTypeButton>{employmentType}</JobTypeButton>
            </Header>
            <Content>
                <Text
                    text={title}
                    textSize="sixteen"
                    color={Colors.textBlack}
                />
                <Text
                    text={`${creator.firstName} - ${creator.firstName}`}
                    textSize="twelve"
                    color={Colors.textGray}
                    family="Epilogue-Regular"
                />
                <Text
                    text={
                        description.length > 50
                            ? `${description.slice(0, 50)}...`
                            : description
                    }
                    textSize="twelve"
                    color={Colors.textGray}
                    margin="10px 0 0 0"
                    family="Epilogue-Regular"
                    lineHeight={18}
                />
            </Content>
            <Tags>
                <Tag text={workType} />
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
    cursor: pointer;

    transition: box-shadow 0.3s ease, transform 0.3s ease;
    border-radius: 10px;

    &:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    @media (max-width: 1200px) {
        min-width: 320px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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
