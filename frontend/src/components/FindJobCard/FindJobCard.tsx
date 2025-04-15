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
};

const FindJobCard: FC<Props> = ({ vacancy, onPress }) => {
    return (
        <Container onClick={onPress}>
            <div className="info">
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
                                text={`${vacancy.views}`}
                                textSize="fourteen"
                                family="Epilogue-Regular"
                                color={Colors.textGray}
                                margin="5px 0 0 0"
                            />
                            <DynamicIcon
                                name={"eye"}
                                size={24}
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
                <Text
                    text={`Salary: ${vacancy.salary.min}-${vacancy.salary.max} ${vacancy.salary.currency}`}
                    color={Colors.textBlack}
                    textSize="eighteen"
                    family="Epilogue-Regular"
                />
            </div>
            <div className="tags">
                <Tag text={vacancy.workType} />
                <Tag text={vacancy.employmentType} />
            </div>
            <div className="company">
                <Avatar size={30} />
                <Text
                    text={`${vacancy.creator.firstName} ${vacancy.creator.lastName}`}
                    color={Colors.textBlack}
                    textSize="fourteen"
                    family="Epilogue-Regular"
                />
            </div>
            <ButtonComp title="Respond" primary className="respond" />
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
    .respond {
        display: flex;
        justify-content: center;
        width: 150px;
        border-radius: 10px;
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
