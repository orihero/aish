import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import ButtonComp from "../Button/Button";
import { Colors } from "../../shared/utils/color";
import { Images } from "../../shared/assets";
import { CreatorType, SalaryType, translationType } from "../../types";
import { observer } from "mobx-react-lite";
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
    isborder?: boolean;
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
    title,
    creator,
    company,
    category,
    subcategory,
    salary,
    employmentType,
    workType,
    isFeatured,
    views,
    timestamps,
    description,
    onPress,
    isborder,
}) => {
    return (
        <JobCardContainer
            onClick={onPress}
            style={{
                border: isborder ? `1px solid ${Colors.lineColor}` : "none",
                borderRadius: 10,
                cursor: "pointer",
            }}
        >
            <Avatar
                imageUrl={
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
            />
            <Content>
                <JobTitle>
                    <Text
                        text={title}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={`${creator.firstName} - ${creator.lastName}`}
                        textSize="twelve"
                        color={Colors.textGray}
                        family="Epilogue-Regular"
                    />
                </JobTitle>
                <Tags>
                    <Tag text={employmentType} />
                    <img src={Images.divider} height={20} alt="" />

                    <Tag text={workType} />
                </Tags>
            </Content>
        </JobCardContainer>
    );
};

export default observer(ShortJobCard);

const JobCardContainer = styled.div`
    display: flex;
    gap: 15px;
    padding: 20px;
    background: white;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    border-radius: 10px;

    &:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
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

// const Tag = styled.span`
//     padding: 5px 10px;
//     border-radius: 10px;
//     font-size: 12px;
// `;
