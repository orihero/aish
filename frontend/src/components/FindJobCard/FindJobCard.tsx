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
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTranslatedEmploymentType, getTranslatedWorkType } from "../../shared/utils/translationHelpers";

type Props = {
    vacancy: VacancyType;
    onPress?: () => void;
    respondPress?: () => void;
};

const FindJobCard: FC<Props> = ({ vacancy, onPress, respondPress }) => {
    const { applicationStore, visibleStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();
    
    // Check if user has already applied to this vacancy
    const hasApplied = applicationStore.hasAppliedToVacancy(vacancy._id);
    const chatId = applicationStore.getChatIdForVacancy(vacancy._id);
    
    const handleApplyOrChat = () => {
        if (hasApplied && chatId) {
            // Navigate to chat if already applied
            navigation(`/chat/${chatId}`);
        } else {
            // Show apply modal if not applied
            respondPress?.();
        }
    };

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
                        <Tag text={getTranslatedWorkType(vacancy.workType, visibleStore.currentLang)} />
                        <Tag text={getTranslatedEmploymentType(vacancy.employmentType, visibleStore.currentLang)} />
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
                    text={`${t("salary")}: ${vacancy.salary.min}-${vacancy.salary.max} ${vacancy.salary.currency}`}
                    color={Colors.textBlack}
                    textSize="eighteen"
                    family="Epilogue-Regular"
                    paddingTop="3px"
                />
                <ButtonComp
                    title={hasApplied ? t("goToChat") : t("apply")}
                    primary
                    className="apply"
                    onPress={handleApplyOrChat}
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
