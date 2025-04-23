import React, { FC } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import { Tag } from "../Tag/Tag";
import Avatar from "../Avatar/Avatar";
import ButtonComp from "../Button/Button";
import { DynamicIcon } from "lucide-react/dynamic";
import { Colors } from "../../shared/utils/color";
import { ApplicationType } from "../../types";
import IconComp from "../../shared/constants/iconBtn";
import { formatDateSmart } from "../../shared/helper/date";

type Props = {
    application: ApplicationType;
    onPress?: () => void;
    goToChat?: () => void;
};

const ApplicationCard: FC<Props> = ({ application, onPress, goToChat }) => {
    return (
        <ApplicationCardContainer>
            <div className="info" onClick={onPress}>
                <div className="status">
                    <Tag
                        text={application.status}
                        backColor={
                            application.status === "pending"
                                ? Colors.lightYellow
                                : application.status === "rejection"
                                ? Colors.lightTomato
                                : application.status === "invitation"
                                ? Colors.lightGreen
                                : Colors.lineColor
                        }
                        color={
                            application.status === "pending"
                                ? Colors.yellow
                                : application.status === "rejection"
                                ? Colors.tomato
                                : application.status === "invitation"
                                ? Colors.green
                                : Colors.lineColor
                        }
                    />
                </div>
                <div className="titleBox">
                    <div className="jobCompanyName">
                        <Text
                            text={application.job.title}
                            color={Colors.textBlack}
                            textSize="twentyTwo"
                            family="Epilogue-SemiBold"
                        />
                        <Text
                            text={`${application.job.company.name}`}
                            color={Colors.textBlack}
                            textSize="fourteen"
                            family="Epilogue-Regular"
                        />
                        <Text
                            text={`${formatDateSmart(application.createdAt)}`}
                            color={Colors.textBlack}
                            textSize="fourteen"
                            family="Epilogue-Regular"
                        />
                        <Text
                            text={`${application.job.requirements.join(", ")}`}
                            color={Colors.textBlack}
                            textSize="fourteen"
                            family="Epilogue-Regular"
                            lineHeight={20}
                        />
                    </div>
                    <div className="companyLogo">
                        <Avatar imageUrl={application.job.company.logo} />
                    </div>
                </div>
            </div>
            <div className="goToTheChat">
                <Text
                    text={application.resume.title}
                    color={Colors.textBlack}
                    textSize="fourteen"
                    family="Epilogue-Regular"
                />
                <ButtonComp
                    title="Go to the chat"
                    backColor={Colors.mainBlueLight}
                    className="respond"
                    onPress={goToChat}
                />
            </div>
        </ApplicationCardContainer>
    );
};

export default ApplicationCard;

const ApplicationCardContainer = styled.div`
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
    .info {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .jobCompanyName {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .respond {
        display: flex;
        justify-content: center;
        width: 150px;
        border-radius: 10px;
    }

    .goToTheChat {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
`;
