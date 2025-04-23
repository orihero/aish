import React, { FC, useEffect, useState } from "react";
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
import Avatar from "../Avatar/Avatar";
import { toJS } from "mobx";

type Props = {
    isShow?: boolean;
};

const ApplyModal: FC<Props> = ({ isShow }) => {
    const { visibleStore, applicationStore, resumeStore } = useRootStore();
    const navigation = useNavigate();

    useEffect(() => {
        resumeStore.getResumeMy();
    }, [resumeStore]);

    const onApply = () => {
        applicationStore.applyToVacancy(() => {
            visibleStore.hide("applyModal");
        });
    };

    return (
        <UploadResumContainer style={{ display: isShow ? "block" : "none" }}>
            <div className="modalBox">
                <div className="close">
                    <IconComp
                        onClick={() => visibleStore.hide("applyModal")}
                        icon={<DynamicIcon name="x-circle" />}
                    />
                </div>
                <div>
                    <Text
                        text={"Vacancy respose"}
                        textSize="eighteen"
                        color={Colors.textBlack}
                        lineHeight={20}
                    />
                    <Text
                        text={"Senior react deeloper"}
                        textSize="eighteen"
                        color={Colors.textBlack}
                        lineHeight={20}
                        margin="10px 0 0 0"
                    />
                </div>
                <div className="selectedResumeWrapper">
                    <div className="selectedResume">
                        <div className="avatarAndName">
                            <Avatar
                                imageUrl={
                                    applicationStore.selectedResume?.parsedData
                                        ?.basics.url
                                }
                                firstName={
                                    applicationStore.selectedResume?.parsedData
                                        ?.basics.name
                                }
                                lastName={
                                    applicationStore.selectedResume?.parsedData
                                        ?.basics.name
                                }
                                backgroundColor={Colors.mainBlue}
                                size={60}
                            />
                            <Text
                                text={
                                    applicationStore.selectedResume?.parsedData
                                        ?.basics.label
                                }
                                textSize="sixteen"
                                color={Colors.textBlack}
                            />
                        </div>
                        {visibleStore.visible.resumeSelect ? (
                            <IconComp
                                icon={<DynamicIcon name="chevron-up" />}
                                onClick={() =>
                                    visibleStore.toglevisible("resumeSelect")
                                }
                            />
                        ) : (
                            <IconComp
                                icon={
                                    <DynamicIcon
                                        name="chevron-down"
                                        onClick={() =>
                                            visibleStore.toglevisible(
                                                "resumeSelect"
                                            )
                                        }
                                    />
                                }
                            />
                        )}
                    </div>
                    {visibleStore.visible.resumeSelect && (
                        <div className="resumesDrop">
                            {resumeStore.myResumesState?.map((item, index) => {
                                return (
                                    <div
                                        className="resumeItem"
                                        key={index}
                                        style={{
                                            border: `1px solid ${
                                                item._id ===
                                                applicationStore.selectedResume
                                                    ._id
                                                    ? Colors.mainBlue
                                                    : Colors.lineColor
                                            }`,
                                        }}
                                        onClick={() =>
                                            applicationStore.setSelectedResume(
                                                item
                                            )
                                        }
                                    >
                                        {item._id ===
                                        applicationStore.selectedResume._id ? (
                                            <DynamicIcon
                                                name="circle-check"
                                                color={Colors.mainBlue}
                                            />
                                        ) : (
                                            <DynamicIcon
                                                name="circle"
                                                color={Colors.mainBlue}
                                            />
                                        )}
                                        <Avatar
                                            imageUrl={
                                                item?.parsedData?.basics?.url
                                            }
                                            firstName={
                                                item?.parsedData?.basics?.name
                                            }
                                            lastName={
                                                item?.parsedData?.basics?.name
                                            }
                                            backgroundColor={Colors.mainBlue}
                                            size={60}
                                        />
                                        <Text
                                            text={
                                                item?.parsedData?.basics?.label
                                            }
                                            textSize="sixteen"
                                            color={Colors.textBlack}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="sendBtn">
                    <ButtonComp
                        title="Send application"
                        primary
                        onPress={onApply}
                        disabled={
                            !applicationStore.selectedResume ||
                            applicationStore.loadings.isApplyingLoading
                        }
                        icon={
                            applicationStore.loadings.isApplyingLoading && (
                                <Spin size="small" style={{ color: "white" }} />
                            )
                        }
                    />
                </div>
            </div>
        </UploadResumContainer>
    );
};

export default observer(ApplyModal);

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
        top: 20px;
        right: 20px;
    }

    .modalBox {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 12;
        width: 400px;
        border-radius: 20px;
        background-color: ${Colors.white};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30px;
        padding: 40px 20px;
    }

    .uploadIcon {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .selectedResumeWrapper {
        position: relative;
        width: 100%;
    }

    .selectedResume {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        width: 100%;
        border: 1px solid ${Colors.lineColor};
        border-radius: 10px;
    }

    .resumesDrop {
        width: 100%;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: ${Colors.white};
        padding: 10px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10;
    }

    .resumeItem {
        display: flex;
        align-items: center;
        padding: 10px;
        width: 100%;
        border: 1px solid ${Colors.lineColor};
        border-radius: 10px;
        gap: 10px;
    }

    .avatarAndName {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .sendBtn {
        display: flex;
        justify-content: end;
    }
`;
