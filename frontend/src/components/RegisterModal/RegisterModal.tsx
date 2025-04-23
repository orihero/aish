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
import { toJS } from "mobx";

type Props = {
    isShow?: boolean;
};

const RegisterModal: FC<Props> = ({ isShow }) => {
    const { resumeStore, visibleStore, authStore } = useRootStore();
    const navigation = useNavigate();

    console.log("resumeStore.registerData", toJS(resumeStore.registerData));

    const CreateResume = () => {
        resumeStore.registerWithResume(() => {
            navigation("/myProfile");
            visibleStore.hide("registerModal");
            authStore.getMe();
        });
    };

    return (
        <UploadResumContainer style={{ display: isShow ? "block" : "none" }}>
            <div className="modalBox">
                <div className="close">
                    <IconComp
                        onClick={() => visibleStore.hide("registerModal")}
                        icon={<DynamicIcon name="x-circle" />}
                    />
                </div>
                <Text
                    text={"Complete Registration"}
                    textSize="eighteen"
                    color={Colors.textBlack}
                    lineHeight={20}
                />
                <div className="inputs">
                    <div className="item">
                        <Text
                            text="First name"
                            textSize="fourteen"
                            color={Colors.textGray}
                        />
                        <input
                            type="text"
                            placeholder=""
                            value={resumeStore.registerData.firstName}
                            onChange={(e) =>
                                resumeStore.setRegisterField(
                                    "firstName",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="item">
                        <Text
                            text="Last name"
                            textSize="fourteen"
                            color={Colors.textGray}
                        />
                        <input
                            type="text"
                            value={resumeStore.registerData.lastName}
                            onChange={(e) =>
                                resumeStore.setRegisterField(
                                    "lastName",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="item">
                        <Text
                            text="Email"
                            textSize="fourteen"
                            color={Colors.textGray}
                        />
                        <input
                            type="text"
                            value={resumeStore.registerData.email}
                            onChange={(e) =>
                                resumeStore.setRegisterField(
                                    "email",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="item">
                        <Text
                            text="Password"
                            textSize="fourteen"
                            color={Colors.textGray}
                        />
                        <input
                            type="text"
                            value={resumeStore.registerData.password}
                            onChange={(e) =>
                                resumeStore.setRegisterField(
                                    "password",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                    <div className="item">
                        <Text
                            text="Password confirm"
                            textSize="fourteen"
                            color={Colors.textGray}
                        />
                        <input
                            type="text"
                            value={resumeStore.registerData.confirmPassword}
                            onChange={(e) =>
                                resumeStore.setRegisterField(
                                    "confirmPassword",
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </div>
                <div className="btns">
                    <ButtonComp
                        title="Cancel"
                        onPress={() => visibleStore.hide("registerModal")}
                    />
                    <ButtonComp
                        title="Register"
                        primary
                        onPress={CreateResume}
                        disabled={
                            !resumeStore.registerData.email ||
                            !resumeStore.registerData.password ||
                            !resumeStore.registerData.resumeData ||
                            !resumeStore.registerData.resumeFile
                        }
                    />
                </div>
            </div>
        </UploadResumContainer>
    );
};

export default observer(RegisterModal);

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
        gap: 20px;
        padding: 40px 30px;
    }

    .uploadIcon {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .inputs {
        display: flex;
        flex-direction: column;
        gap: 15px;
        input {
            width: 100%;
            padding: 10px;
            outline: none;
            border: 1px solid ${Colors.lineColor};
            border-radius: 6px;
        }
    }
    .item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 20px;
        margin-top: 20px;
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
