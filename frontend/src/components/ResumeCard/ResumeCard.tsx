import React, { FC } from "react";
import { FullResumeType, UserFullType } from "../../types";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import Avatar from "../Avatar/Avatar";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";

type Props = {
    resume: FullResumeType;
    onPress?: () => void;
};

const ResumeCard: FC<Props> = ({ resume, onPress }) => {
    console.log("resume", toJS(resume));
    const navigation = useNavigate();

    const ToEditResume = () => {
        navigation("/resumePreview");
    };

    return (
        <ResumeCardContainer onClick={onPress}>
            <div className="resumeCard">
                <div>
                    <Avatar
                        firstName={resume.parsedData.basics.name
                            .split(" ")
                            .slice(0, 1)
                            .join()}
                        lastName={resume.parsedData.basics.name
                            .split(" ")
                            .slice(1, 2)
                            .join()}
                        backgroundColor={Colors.mainBlue}
                        size={100}
                    />
                </div>
                <div className="username">
                    <Text
                        text={resume.parsedData.basics.label}
                        textSize="twenty"
                        color={Colors.textBlack}
                    />
                    <Text
                        text={resume.parsedData.basics.name}
                        textSize="fourteen"
                        color={Colors.textBlack}
                    />
                </div>
            </div>
            <div className="rightBox">
                <IconComp icon={<DynamicIcon name="download-cloud" />} />
                <IconComp icon={<DynamicIcon name="edit" />} />
            </div>
        </ResumeCardContainer>
    );
};

export default observer(ResumeCard);

const ResumeCardContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border: 1px solid ${Colors.lineColor};
    padding: 20px;
    border-radius: 15px;

    .resumeCard {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .rightBox {
        display: flex;
        gap: 20px;
    }

    .username {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;
