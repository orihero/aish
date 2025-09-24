import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { DynamicIcon } from "lucide-react/dynamic";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Avatar from "../Avatar/Avatar";
import { useTranslation } from "react-i18next";

type Props = {
    isShow?: boolean;
};

const ApplyModal: FC<Props> = ({ isShow }) => {
    const { visibleStore, applicationStore, resumeStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        resumeStore.getResumeMy();
    }, [resumeStore]);

    // Auto-select first resume when resumes are loaded
    useEffect(() => {
        if (resumeStore.myResumesState?.length > 0 && !applicationStore.selectedResume._id) {
            applicationStore.setSelectedResume(resumeStore.myResumesState[0]);
        }
    }, [resumeStore.myResumesState, applicationStore]);

    const onApply = () => {
        applicationStore.applyToVacancy((chatId) => {
            if (chatId) {
                console.log("Navigating to chat:", chatId);
                // Navigate to the chat after successful application
                navigation(`/chat/${chatId}`);
            } else {
                console.error("No chat ID provided for navigation");
            }
        });
    };

    return (
        <ModalOverlay style={{ display: isShow ? "flex" : "none" }}>
            <ModalContainer>
                <ModalHeader>
                    <div className="headerContent">
                        <div className="titleSection">
                            <h2 className="modalTitle">{t("vacancyResponse")}</h2>
                            <p className="vacancyTitle">
                                {applicationStore.respondVacancy?.title || t("noVacancySelected")}
                            </p>
                        </div>
                        <button 
                            className="closeButton"
                            onClick={() => visibleStore.hide("applyModal")}
                        >
                            <DynamicIcon name="x" size={20} />
                        </button>
                    </div>
                </ModalHeader>

                <ModalBody>
                    <div className="resumeSection">
                        <label className="sectionLabel">{t("selectResume")}</label>
                        <div className="resumeSelector">
                            <div 
                                className="selectedResume"
                                onClick={() => visibleStore.toglevisible("resumeSelect")}
                            >
                                <div className="resumeInfo">
                                    <Avatar
                                        imageUrl={applicationStore.selectedResume?.parsedData?.basics?.url}
                                        firstName={applicationStore.selectedResume?.parsedData?.basics?.name || t("unknown")}
                                        lastName={applicationStore.selectedResume?.parsedData?.basics?.name || t("user")}
                                        backgroundColor={Colors.mainBlue}
                                        size={48}
                                        textSize="sixteen"
                                    />
                                    <div className="resumeDetails">
                                        <span className="resumeName">
                                            {applicationStore.selectedResume?.parsedData?.basics?.label || t("noResumeSelected")}
                                        </span>
                                        <span className="resumeSubtext">
                                            {applicationStore.selectedResume?.parsedData?.basics?.name || t("clickToSelect")}
                                        </span>
                                    </div>
                                </div>
                                <div className="dropdownIcon">
                                    <DynamicIcon 
                                        name={visibleStore.visible.resumeSelect ? "chevron-up" : "chevron-down"} 
                                        size={20}
                                    />
                                </div>
                            </div>

                            {visibleStore.visible.resumeSelect && (
                                <div className="resumeDropdown">
                                    {resumeStore.myResumesState?.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`resumeOption ${item._id === applicationStore.selectedResume?._id ? 'selected' : ''}`}
                                            onClick={() => {
                                                applicationStore.setSelectedResume(item);
                                                visibleStore.toglevisible("resumeSelect");
                                            }}
                                        >
                                            <div className="optionContent">
                                                <Avatar
                                                    imageUrl={item?.parsedData?.basics?.url}
                                                    firstName={item?.parsedData?.basics?.name}
                                                    lastName={item?.parsedData?.basics?.name}
                                                    backgroundColor={Colors.mainBlue}
                                                    size={40}
                                                    textSize="sixteen"
                                                />
                                                <div className="optionDetails">
                                                    <span className="optionName">
                                                        {item?.parsedData?.basics?.label}
                                                    </span>
                                                    <span className="optionSubtext">
                                                        {item?.parsedData?.basics?.name}
                                                    </span>
                                                </div>
                                            </div>
                                            {item._id === applicationStore.selectedResume?._id && (
                                                <DynamicIcon name="check" size={16} color={Colors.mainBlue} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <button
                        className="applyButton"
                        onClick={onApply}
                        disabled={
                            !applicationStore.selectedResume?._id ||
                            !applicationStore.respondVacancy?._id ||
                            applicationStore.loadings.isApplyingLoading
                        }
                    >
                        {applicationStore.loadings.isApplyingLoading ? (
                            <>
                                <Spin size="small" style={{ color: "white", marginRight: "8px" }} />
                                {t("sending")}...
                            </>
                        ) : (
                            <>
                                <DynamicIcon name="send" size={16} />
                                {t("sendApplication")}
                            </>
                        )}
                    </button>
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default observer(ApplyModal);

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease-out;
    
    @media (max-width: 640px) {
        padding: 16px;
        align-items: flex-end;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContainer = styled.div`
    background: ${Colors.white};
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
    position: relative;
    
    @media (max-width: 640px) {
        border-radius: 24px 24px 0 0;
        max-height: 85vh;
        margin-bottom: 0;
    }
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(70, 64, 222, 0.3), transparent);
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const ModalHeader = styled.div`
    padding: 32px 32px 24px;
    border-bottom: 1px solid ${Colors.lineColor};
    
    @media (max-width: 640px) {
        padding: 24px 20px 20px;
    }
    
    .headerContent {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
    }
    
    .titleSection {
        flex: 1;
    }
    
    .modalTitle {
        font-size: 24px;
        font-weight: 700;
        color: ${Colors.textBlack};
        margin: 0 0 8px 0;
        line-height: 1.2;
        
        @media (max-width: 640px) {
            font-size: 20px;
        }
    }
    
    .vacancyTitle {
        font-size: 16px;
        color: ${Colors.textGray};
        margin: 0;
        line-height: 1.4;
        font-weight: 500;
        
        @media (max-width: 640px) {
            font-size: 14px;
        }
    }
    
    .closeButton {
        background: none;
        border: none;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        color: ${Colors.textGray};
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
            background: ${Colors.light};
            color: ${Colors.textBlack};
        }
    }
`;

const ModalBody = styled.div`
    padding: 24px 32px;
    
    @media (max-width: 640px) {
        padding: 20px;
    }
    
    .resumeSection {
        .sectionLabel {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: ${Colors.textBlack};
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    }
    
    .resumeSelector {
        position: relative;
    }
    
    .selectedResume {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border: 2px solid ${Colors.lineColor};
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: ${Colors.white};
        position: relative;
        overflow: hidden;
        
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(70, 64, 222, 0.05), transparent);
            transition: left 0.5s ease;
        }
        
        &:hover {
            border-color: ${Colors.mainBlue};
            box-shadow: 0 0 0 3px ${Colors.mainBlueLight};
            
            &::before {
                left: 100%;
            }
        }
        
        &:focus-within {
            border-color: ${Colors.mainBlue};
            box-shadow: 0 0 0 3px ${Colors.mainBlueLight};
        }
    }
    
    .resumeInfo {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
    }
    
    .resumeDetails {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .resumeName {
        font-size: 16px;
        font-weight: 600;
        color: ${Colors.textBlack};
        line-height: 1.3;
    }
    
    .resumeSubtext {
        font-size: 14px;
        color: ${Colors.textGray};
        line-height: 1.3;
    }
    
    .dropdownIcon {
        color: ${Colors.textGray};
        transition: transform 0.2s ease;
    }
    
    .resumeDropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: ${Colors.white};
        border: 1px solid ${Colors.lineColor};
        border-radius: 16px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10;
        margin-top: 8px;
        overflow: hidden;
        animation: dropdownSlide 0.2s ease-out;
        
        @keyframes dropdownSlide {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
    
    .resumeOption {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid ${Colors.lineColor};
        
        &:last-child {
            border-bottom: none;
        }
        
        &:hover {
            background: ${Colors.light};
        }
        
        &.selected {
            background: ${Colors.mainBlueLight};
            border-color: ${Colors.mainBlue};
        }
    }
    
    .optionContent {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
    }
    
    .optionDetails {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .optionName {
        font-size: 15px;
        font-weight: 500;
        color: ${Colors.textBlack};
        line-height: 1.3;
    }
    
    .optionSubtext {
        font-size: 13px;
        color: ${Colors.textGray};
        line-height: 1.3;
    }
`;

const ModalFooter = styled.div`
    padding: 24px 32px 32px;
    border-top: 1px solid ${Colors.lineColor};
    
    @media (max-width: 640px) {
        padding: 20px;
    }
    
    .applyButton {
        width: 100%;
        background: linear-gradient(135deg, ${Colors.mainBlue} 0%, ${Colors.secondBlue} 100%);
        color: ${Colors.white};
        border: none;
        border-radius: 16px;
        padding: 16px 24px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(70, 64, 222, 0.3);
        
        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(70, 64, 222, 0.4);
        }
        
        &:active:not(:disabled) {
            transform: translateY(0);
        }
        
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: 0 4px 12px rgba(70, 64, 222, 0.2);
        }
    }
`;
