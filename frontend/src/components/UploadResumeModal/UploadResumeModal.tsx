import React, { FC, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt } from "react-icons/fa"; // upload icon
import { DynamicIcon } from "lucide-react/dynamic";
import ButtonComp from "../Button/Button";
import useRootStore from "../../shared/hooks/UseRootStore";
import Text from "../Text/Text";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import IconComp from "../../shared/constants/iconBtn";

type Props = {
    isShow?: boolean;
};

const UploadResumeModal: FC<Props> = ({ isShow }) => {
    const { resumeStore, visibleStore } = useRootStore();
    const navigation = useNavigate();

    const CreateResume = () => {
        resumeStore.onCreateResume(() => {
            navigation("/resumePreview");
            visibleStore.hide("createResumeModal");
        });
    };

    return (
        <UploadResumContainer style={{ display: isShow ? "block" : "none" }}>
            <div className="modalBox">
                <div className="close">
                    <IconComp
                        onClick={() => visibleStore.hide("createResumeModal")}
                        icon={<DynamicIcon name="x-circle" />}
                    />
                </div>
                <Text
                    text={
                        resumeStore.loadings.isCreateResumeLoading
                            ? "Please wait! Resume is being analyzed, this will take some time. Do not refresh the window!"
                            : "Please select your resume or cvFile"
                    }
                    textSize="eighteen"
                    color={Colors.textBlack}
                    textAlign={"center"}
                    lineHeight={20}
                />
                {!resumeStore.loadings.isCreateResumeLoading && (
                    <label htmlFor="resume-upload" className="uploadIcon">
                        <DynamicIcon
                            name="upload-cloud"
                            size={60}
                            color={Colors.mainBlue}
                        />
                        <input
                            id="resume-upload"
                            type="file"
                            hidden
                            onChange={(e) =>
                                resumeStore.setResume(
                                    e?.target?.files?.[0] ?? undefined
                                )
                            }
                        />
                        {resumeStore.fileName && (
                            <Text
                                text={resumeStore.fileName}
                                textSize="sixteen"
                                color={Colors.textBlack}
                            />
                        )}
                    </label>
                )}
                {resumeStore.loadings.isCreateResumeLoading ? (
                    <Spin size="large" />
                ) : (
                    <ButtonComp
                        title="Analyze"
                        primary
                        onPress={CreateResume}
                        disabled={!resumeStore.fileName}
                    />
                )}
            </div>
        </UploadResumContainer>
    );
};

export default observer(UploadResumeModal);

const UploadResumContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 11;

    .close {
        position: absolute;
        z-index: 13;
        top: 10px;
        right: 10px;
    }

    .modalBox {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 12;
        width: 320px;
        height: 250px;
        border-radius: 20px;
        background-color: ${Colors.white};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        /* gap: 30px; */
        padding: 40px 20px;
    }

    .uploadIcon {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
`;

const CreateResumeButton = styled.button`
    background-color: ${Colors.mainBlue};
    color: ${Colors.white};
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;
