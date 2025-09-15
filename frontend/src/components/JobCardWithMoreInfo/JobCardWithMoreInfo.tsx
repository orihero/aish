import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Colors } from "../../shared/utils/color";
import { VacancyType } from "../../types";
import Avatar from "../Avatar/Avatar";
import { Tag } from "../Tag/Tag";
import { observer } from "mobx-react-lite";
import useRootStore from "../../shared/hooks/UseRootStore";
import { getTranslatedEmploymentType, getTranslatedWorkType, getTranslatedValue } from "../../shared/utils/translationHelpers";

type Props = {
    vacancy: VacancyType;
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

const JobCard: FC<Props> = ({ vacancy, onPress }) => {
    const { visibleStore } = useRootStore();
    
    return (
        <JobCardContainer onClick={onPress}>
            <Header>
                <div className="companyInfo">
                    <Avatar imageUrl={vacancy?.company?.logo} />
                    <Text
                        text={vacancy?.company?.name}
                        textSize="twelve"
                        color={Colors.textGray}
                        family="Epilogue-Regular"
                    />
                </div>
                <JobTypeButton>{getTranslatedEmploymentType(vacancy?.employmentType, visibleStore.currentLang)}</JobTypeButton>
            </Header>
            <Content>
                <Text
                    text={getTranslatedValue(vacancy?.title, visibleStore.currentLang)}
                    textSize="sixteen"
                    color={Colors.textBlack}
                />

                <Text
                    text={
                        vacancy?.description.length > 50
                            ? `${vacancy?.description.slice(0, 50)}...`
                            : vacancy?.description
                    }
                    textSize="twelve"
                    color={Colors.textGray}
                    margin="10px 0 0 0"
                    family="Epilogue-Regular"
                    lineHeight={18}
                />
            </Content>
            <Tags>
                <Tag text={getTranslatedWorkType(vacancy?.workType, visibleStore.currentLang)} />
            </Tags>
        </JobCardContainer>
    );
};

export default observer(JobCard);

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

    /* &:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    } */

    @media (max-width: 1200px) {
        min-width: 320px;
    }
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .companyInfo {
        display: flex;
        align-items: center;
        gap: 10px;
    }
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
