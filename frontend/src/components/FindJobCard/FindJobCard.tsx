import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { VacancyType } from "../../types";
import { observer } from "mobx-react-lite";
import { DynamicIcon } from "lucide-react/dynamic";
import { Colors } from "../../shared/utils/color";
import { Tag } from "../Tag/Tag";
import ButtonComp from "../Button/Button";
import Avatar from "../Avatar/Avatar";
import IconComp from "../../shared/constants/iconBtn";

type Props = {
    vacancy: VacancyType;
    onPress?: () => void;
    respondPress?: () => void;
};

const FindJobCard: FC<Props> = ({ vacancy, onPress, respondPress }) => {
    return (
        <Container>
            <div className="info" onClick={onPress}>
                <div className="titleBox">
                    <Text
                        text={vacancy.title}
                        color={Colors.textBlack}
                        textSize="twentyTwo"
                        className="title"
                        family="Epilogue-SemiBold"
                    />
                    <div className="views">
                        <div className="viewsCount">
                            <Text
                                text={`${vacancy.applicationsCount}`}
                                textSize="sixteen"
                                family="Epilogue-Regular"
                                color={Colors.textGray}
                                paddingTop="3px"
                            />
                            <DynamicIcon
                                name={"file-check"}
                                size={18}
                                color={Colors.textGray}
                            />
                        </div>
                        <div className="viewsCount">
                            <Text
                                text={`${vacancy.views}`}
                                textSize="sixteen"
                                family="Epilogue-Regular"
                                color={Colors.textGray}
                                paddingTop="3px"
                            />
                            <DynamicIcon
                                name={"eye"}
                                size={20}
                                color={Colors.textGray}
                            />
                        </div>
                        <IconComp
                            icon={
                                <DynamicIcon
                                    name={"heart"}
                                    size={24}
                                    color={Colors.textGray}
                                />
                            }
                        />
                    </div>
                </div>
                <div className="company">
                    <Avatar size={40} imageUrl={vacancy.company.logo} />
                    <Text
                        text={`${vacancy.company.name}`}
                        color={Colors.textBlack}
                        textSize="fourteen"
                        family="Epilogue-Regular"
                        paddingTop="3px"
                    />
                    <div className="tags">
                        <Tag text={vacancy.workType} />
                        <Tag text={vacancy.employmentType} />
                    </div>
                </div>
                <Text
                    text={`${vacancy.description.slice(0, 200) + "..."}`}
                    color={Colors.textBlack}
                    textSize="fourteen"
                    family="Epilogue-Regular"
                    paddingTop="3px"
                />
            </div>
            <div className="companyAndApply">
                <Text
                    text={`Salary: ${vacancy.salary.min}-${vacancy.salary.max} ${vacancy.salary.currency}`}
                    color={Colors.textBlack}
                    textSize="eighteen"
                    family="Epilogue-Regular"
                    paddingTop="3px"
                />
                <ButtonComp
                    title="Apply"
                    primary
                    className="apply"
                    onPress={respondPress}
                />
            </div>
        </Container>
    );
};

export default observer(FindJobCard);

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    border: 1px solid ${Colors.lineColor};
    padding: 20px;
    border-radius: 16px;
    cursor: pointer;
    position: relative;

    .titleBox {
        display: flex;
        justify-content: space-between;
    }
    .title {
        align-self: flex-end;
    }
    .info {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .company {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .tags {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .companyAndApply {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .apply {
        display: flex;
        justify-content: center;
        width: 150px;
        border-radius: 10px;
        position: relative;
        z-index: 10;
    }

    .views {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    .viewsCount {
        display: flex;
        gap: 5px;
        align-items: center;
    }
`;
