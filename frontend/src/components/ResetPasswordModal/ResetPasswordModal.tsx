import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { DynamicIcon } from "lucide-react/dynamic";
import ButtonComp from "../Button/Button";
import useRootStore from "../../shared/hooks/UseRootStore";
import Text from "../Text/Text";
import { Spin } from "antd";
import IconComp from "../../shared/constants/iconBtn";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import APIs from "../../shared/api/api";

type Props = {
    isShow?: boolean;
};

const ResetPasswordModal: FC<Props> = ({ isShow }) => {
    const { visibleStore } = useRootStore();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        // Get token from URL params
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setError(t("pleaseFillAllFields"));
            return;
        }

        if (password !== confirmPassword) {
            setError(t("passwordsDoNotMatch"));
            return;
        }

        if (password.length < 6) {
            setError(t("passwordTooShort"));
            return;
        }

        if (!token) {
            setError(t("invalidResetToken"));
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await APIs.auth.resetPassword({
                token,
                password
            });

            if (response.data) {
                setSuccess(t("passwordResetSuccessful"));
                setPassword("");
                setConfirmPassword("");
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    handleClose();
                    visibleStore.show("loginModal");
                }, 2000);
            }
        } catch (error: any) {
            // Handle specific error messages from the backend
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        visibleStore.hide("resetPasswordModal");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
        navigate("/"); // Navigate back to home
    };

    const handleBackToLogin = () => {
        handleClose();
        visibleStore.show("loginModal");
    };

    return (
        <ResetPasswordModalContainer style={{ display: isShow ? "block" : "none" }}>
            <div className="modalBox">
                <div className="close">
                    <IconComp
                        onClick={handleClose}
                        icon={<DynamicIcon name="x-circle" />}
                    />
                </div>
                
                <div className="header">
                    <div className="icon-wrapper">
                        <DynamicIcon 
                            name="shield-check" 
                            size={32} 
                            color={Colors.mainBlue}
                        />
                    </div>
                    <Text
                        text={t("resetPassword")}
                        textSize="twentyTwo"
                        color={Colors.textBlack}
                        lineHeight={28}
                    />
                    <Text
                        text={t("resetPasswordSubtitle")}
                        textSize="fourteen"
                        color={Colors.textGray}
                        lineHeight={20}
                    />
                </div>

                <div className="form">
                    <div className="inputGroup">
                        <label className="label">
                            <DynamicIcon 
                                name="lock" 
                                size={16} 
                                color={Colors.textGray}
                            />
                            <Text
                                text={t("newPassword")}
                                textSize="fourteen"
                                color={Colors.textGray}
                            />
                        </label>
                        <input
                            type="password"
                            className="input"
                            placeholder={t("enterNewPassword")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="inputGroup">
                        <label className="label">
                            <DynamicIcon 
                                name="lock" 
                                size={16} 
                                color={Colors.textGray}
                            />
                            <Text
                                text={t("confirmNewPassword")}
                                textSize="fourteen"
                                color={Colors.textGray}
                            />
                        </label>
                        <input
                            type="password"
                            className="input"
                            placeholder={t("confirmNewPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                        />
                    </div>

                    {success && (
                        <div className="successMessage">
                            <DynamicIcon 
                                name="check-circle" 
                                size={16} 
                                color={Colors.green}
                            />
                            <Text
                                text={success}
                                textSize="fourteen"
                                color={Colors.green}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="errorMessage">
                            <DynamicIcon 
                                name="alert-circle" 
                                size={16} 
                                color={Colors.tomato}
                            />
                            <Text
                                text={error}
                                textSize="fourteen"
                                color={Colors.tomato}
                            />
                        </div>
                    )}

                    <ButtonComp
                        title={isLoading ? "" : t("resetPassword")}
                        primary
                        onPress={handleResetPassword}
                        disabled={isLoading || !password || !confirmPassword}
                        icon={isLoading ? <Spin size="small" /> : undefined}
                    />
                </div>

                <div className="footer">
                    <Text
                        text={t("rememberPassword")}
                        textSize="fourteen"
                        color={Colors.textGray}
                    />
                    <button 
                        className="backToLoginLink"
                        onClick={handleBackToLogin}
                    >
                        <Text
                            text={t("backToLogin")}
                            textSize="fourteen"
                            color={Colors.mainBlue}
                        />
                    </button>
                </div>
            </div>
        </ResetPasswordModalContainer>
    );
};

export default observer(ResetPasswordModal);

const ResetPasswordModalContainer = styled.div`
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
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from {
            opacity: 0;
            backdrop-filter: blur(0px);
        }
        to {
            opacity: 1;
            backdrop-filter: blur(8px);
        }
    }

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
        animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        overflow: hidden;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @keyframes slideIn {
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
            background: linear-gradient(135deg, ${Colors.mainBlue}15, ${Colors.mainBlue}25);
            margin-bottom: 16px;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-bottom: 24px;
    }

    .inputGroup {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .label {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .input {
        width: 100%;
        padding: 16px;
        border: 2px solid ${Colors.lineColor};
        border-radius: 12px;
        font-size: 16px;
        transition: all 0.2s ease;
        background-color: ${Colors.white};
        
        &:focus {
            outline: none;
            border-color: ${Colors.mainBlue};
            box-shadow: 0 0 0 3px ${Colors.mainBlue}15;
        }
        
        &:disabled {
            background-color: ${Colors.light};
            cursor: not-allowed;
        }
        
        &::placeholder {
            color: ${Colors.textGray};
        }
    }

    .successMessage {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background-color: ${Colors.lightGreen};
        border: 1px solid ${Colors.green}30;
        border-radius: 8px;
    }

    .errorMessage {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background-color: ${Colors.lightTomato};
        border: 1px solid ${Colors.tomato}30;
        border-radius: 8px;
    }

    .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding-top: 16px;
        border-top: 1px solid ${Colors.lineColor};
    }

    .backToLoginLink {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        
        &:hover {
            opacity: 0.8;
        }
    }

    @media (max-width: 640px) {
        .modalBox {
            width: calc(100vw - 32px);
            padding: 24px;
            border-radius: 20px;
        }
        
        .header {
            margin-bottom: 24px;
            
            .icon-wrapper {
                width: 56px;
                height: 56px;
                margin-bottom: 12px;
            }
        }
        
        .form {
            gap: 16px;
            margin-bottom: 20px;
        }
    }
`;
