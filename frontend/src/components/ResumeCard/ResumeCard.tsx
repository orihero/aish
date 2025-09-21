import React, { FC } from "react";
import { FullResumeType } from "../../types";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import Avatar from "../Avatar/Avatar";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import { toJS } from "mobx";
import { useNavigate } from "react-router-dom";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useTranslation } from "react-i18next";

type Props = {
    resume: FullResumeType;
    onPress?: () => void;
};

const ResumeCard: FC<Props> = ({ resume, onPress }) => {
    console.log("resume", toJS(resume));
    const navigation = useNavigate();
    const { resumeStore, visibleStore } = useRootStore();
    const { t } = useTranslation();

    const ToEditResume = () => {
        resumeStore.setResumeForEditing(resume);
        visibleStore.show("isResumeEditable");
        navigation("/resumePreview");
    };

    const handleDownloadResume = async () => {
        try {
            const result = await resumeStore.downloadResumePDF(resume._id, resume.parsedData.basics.name);
            if (result.success) {
                console.log(t("resumeDownloadedSuccessfully"));
            } else {
                console.error("Failed to download resume:", result.error);
                alert("Failed to download resume. Please try again.");
            }
        } catch (error) {
            console.error("Error downloading resume:", error);
            alert("An error occurred while downloading the resume.");
        }
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
                <IconComp 
                    icon={<DynamicIcon name="edit" />} 
                    onClick={ToEditResume}
                />
                <IconComp 
                    icon={<DynamicIcon name="download-cloud" />} 
                    onClick={handleDownloadResume}
                    disabled={resumeStore.loadings.isDownloadingResume}
                />
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
        gap: 15px;
    }

    .username {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;
