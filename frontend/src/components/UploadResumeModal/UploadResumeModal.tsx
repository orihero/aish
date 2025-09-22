import React, { FC, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";
import { DynamicIcon } from "lucide-react/dynamic";
import ButtonComp from "../Button/Button";
import useRootStore from "../../shared/hooks/UseRootStore";
import Text from "../Text/Text";
import { useNavigate } from "react-router-dom";
import { Spin, Progress } from "antd";
import IconComp from "../../shared/constants/iconBtn";
import { useTranslation } from "react-i18next";

type Props = {
    isShow?: boolean;
};

const UploadResumeModal: FC<Props> = ({ isShow }) => {
    const { resumeStore, visibleStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const CreateResume = () => {
        resumeStore.onCreateResume(() => {
            navigation("/resumePreview");
            visibleStore.hide("createResumeModal");
        });
    };

    const handleFileSelect = (file: File | undefined) => {
        if (file) {
            resumeStore.setResume(file);
            // Simulate upload progress
            setUploadProgress(0);
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FaFilePdf size={24} color="#e74c3c" />;
            case 'doc':
            case 'docx':
                return <FaFileWord size={24} color="#2c5aa0" />;
            default:
                return <FaFileAlt size={24} color={Colors.textGray} />;
        }
    };

    return (
        <UploadResumContainer style={{ display: isShow ? "block" : "none" }}>
            <div className="modalBox">
                <div className="close">
                    <IconComp
                        onClick={() => {
                            visibleStore.hide("createResumeModal");
                            // Clear upload state when modal is closed
                            resumeStore.clearResumeUpload();
                            setUploadProgress(0);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                        icon={<DynamicIcon name="x" size={20} />}
                    />
                </div>
                
                <div className="header">
                    <div className="icon-wrapper">
                        <DynamicIcon
                            name="file-text"
                            size={32}
                            color={Colors.mainBlue}
                        />
                    </div>
                    <Text
                        text={t("uploadYourResume")}
                        textSize="twenty"
                        color={Colors.textBlack}
                        textAlign="center"
                        family="Epilogue-Bold"
                    />
                    <Text
                        text={t("uploadResumeDescription")}
                        textSize="fourteen"
                        color={Colors.textGray}
                        textAlign="center"
                        lineHeight={20}
                    />
                </div>

                {!resumeStore.loadings.isCreateResumeLoading ? (
                    <div className="upload-section">
                        <div 
                            className={`upload-area ${isDragOver ? 'drag-over' : ''} ${resumeStore.fileName ? 'file-selected' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                hidden
                                onChange={(e) => handleFileSelect(e?.target?.files?.[0])}
                            />
                            
                            {resumeStore.fileName ? (
                                <div className="file-info">
                                    {getFileIcon(resumeStore.fileName)}
                                    <div className="file-details">
                                        <Text
                                            text={resumeStore.fileName}
                                            textSize="fourteen"
                                            color={Colors.textBlack}
                                            family="Epilogue-Medium"
                                        />
                                        <Text
                                            text={t("clickToChangeFile")}
                                            textSize="twelve"
                                            color={Colors.textGray}
                                        />
                                    </div>
                                    <div className="remove-file" onClick={(e) => {
                                        e.stopPropagation();
                                        resumeStore.setResume(undefined);
                                        setUploadProgress(0);
                                        // Clear the file input value to allow re-uploading the same file
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}>
                                        <DynamicIcon name="x" size={16} color={Colors.textGray} />
                                    </div>
                                </div>
                            ) : (
                                <div className="upload-content">
                                    <div className="upload-icon">
                                        <FaCloudUploadAlt size={48} color={Colors.mainBlue} />
                                    </div>
                                    <Text
                                        text={t("dragDropResume")}
                                        textSize="sixteen"
                                        color={Colors.textBlack}
                                        textAlign="center"
                                        family="Epilogue-Medium"
                                    />
                                    <Text
                                        text={t("orClickToBrowse")}
                                        textSize="fourteen"
                                        color={Colors.textGray}
                                        textAlign="center"
                                    />
                                    <div className="supported-formats">
                                        <Text
                                            text={t("supportedFormats")}
                                            textSize="twelve"
                                            color={Colors.textGray}
                                            textAlign="center"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="progress-section">
                                <Progress 
                                    percent={uploadProgress} 
                                    size="small"
                                    strokeColor={Colors.mainBlue}
                                    showInfo={false}
                                />
                                <Text
                                    text={t("uploading")}
                                    textSize="twelve"
                                    color={Colors.textGray}
                                    textAlign="center"
                                />
                            </div>
                        )}

                        <ButtonComp
                            title={t("analyzeResume")}
                            primary
                            onPress={CreateResume}
                            disabled={!resumeStore.fileName}
                            className="analyze-button"
                        />
                    </div>
                ) : (
                    <div className="loading-section">
                        <div className="loading-content">
                            <div className="loading-icon">
                                <Spin size="large" />
                            </div>
                            <Text
                                text={t("analyzingResume")}
                                textSize="sixteen"
                                color={Colors.textBlack}
                                textAlign="center"
                                family="Epilogue-Medium"
                            />
                            <Text
                                text={t("analyzingDescription")}
                                textSize="fourteen"
                                color={Colors.textGray}
                                textAlign="center"
                                lineHeight={20}
                            />
                            <div className="loading-tips">
                                <Text
                                    text={t("analyzingTip")}
                                    textSize="twelve"
                                    color={Colors.textGray}
                                    textAlign="center"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </UploadResumContainer>
    );
};

export default observer(UploadResumeModal);

// Animations
const fadeIn = keyframes`
    from {
        opacity: 0;
        backdrop-filter: blur(0px);
    }
    to {
        opacity: 1;
        backdrop-filter: blur(8px);
    }
`;

const pulse = keyframes`
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
`;

const slideIn = keyframes`
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8) translateY(-20px);
    }
    50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.05) translateY(0);
    }
    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1) translateY(0);
    }
`;

const UploadResumContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 110;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    animation: ${fadeIn} 0.3s ease-out;

    .close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 13;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        background-color: ${Colors.light};
        transition: all 0.2s ease;
        
        &:hover {
            background-color: ${Colors.lineColor};
            transform: scale(1.1);
        }
    }

    .modalBox {
        position: relative;
        width: 480px;
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 40px);
        border-radius: 24px;
        background-color: ${Colors.white};
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        padding: 32px;
        animation: ${slideIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

    }

    .header {
        text-align: center;
        margin-bottom: 32px;
        
        .icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border-radius: 16px;
            background: linear-gradient(135deg, ${Colors.mainBlueLight}, ${Colors.mainBlue});
            margin-bottom: 16px;
            animation: ${pulse} 2s infinite;
        }
    }

    .upload-section {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .upload-area {
        border: 2px dashed ${Colors.lineColor};
        border-radius: 16px;
        padding: 32px 24px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: ${Colors.light};
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;

        &:hover {
            border-color: ${Colors.mainBlue};
            background-color: ${Colors.mainBlueLight};
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(70, 64, 222, 0.15);
        }

        &.drag-over {
            border-color: ${Colors.mainBlue};
            background-color: ${Colors.mainBlueLight};
            transform: scale(1.02);
            box-shadow: 0 12px 30px rgba(70, 64, 222, 0.2);
        }

        &.file-selected {
            border-color: ${Colors.green};
            background-color: ${Colors.lightGreen};
            border-style: solid;
        }

        .upload-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            
            .upload-icon {
                margin-bottom: 8px;
            }
            
            .supported-formats {
                margin-top: 8px;
                padding: 8px 16px;
                background-color: ${Colors.white};
                border-radius: 8px;
                border: 1px solid ${Colors.lineColor};
            }
        }

        .file-info {
            display: flex;
            align-items: center;
            gap: 16px;
            width: 100%;
            padding: 16px;
            background-color: ${Colors.white};
            border-radius: 12px;
            border: 1px solid ${Colors.lineColor};
            
            .file-details {
                flex: 1;
                text-align: left;
            }
            
            .remove-file {
                cursor: pointer;
                padding: 8px;
                border-radius: 50%;
                background-color: ${Colors.light};
                transition: all 0.2s ease;
                
                &:hover {
                    background-color: ${Colors.lightTomato};
                    color: ${Colors.tomato};
                }
            }
        }
    }

    .progress-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        background-color: ${Colors.light};
        border-radius: 12px;
    }

    .analyze-button {
        width: 100%;
        padding: 16px;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(70, 64, 222, 0.3);
        }
        
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    .loading-section {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
        
        .loading-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            
            .loading-icon {
                margin-bottom: 8px;
            }
            
            .loading-tips {
                margin-top: 16px;
                padding: 12px 20px;
                background-color: ${Colors.light};
                border-radius: 12px;
                border-left: 4px solid ${Colors.mainBlue};
            }
        }
    }

    @media (max-width: 640px) {
        padding: 16px;
        
        .modalBox {
            width: 100%;
            max-width: calc(100vw - 32px);
            padding: 24px;
        }
        
        .upload-area {
            min-height: 160px;
            padding: 24px 16px;
        }
    }
`;
