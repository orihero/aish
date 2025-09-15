import React, { FC, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { DynamicIcon } from "lucide-react/dynamic";
import ButtonComp from "../Button/Button";
import useRootStore from "../../shared/hooks/UseRootStore";
import Text from "../Text/Text";
import { useTranslation } from "react-i18next";
import IconComp from "../../shared/constants/iconBtn";
import { Spin } from "antd";

type Props = {
    isShow?: boolean;
};

const LoginModal: FC<Props> = ({ isShow }) => {
    const { authStore, visibleStore, localStore } = useRootStore();
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await authStore.login(email, password);
            if (response) {
                // Login successful, close modal and refresh user data
                visibleStore.hide("loginModal");
                await authStore.getMe();
                setEmail("");
                setPassword("");
            }
        } catch (error: any) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        visibleStore.hide("loginModal");
        setEmail("");
        setPassword("");
        setError("");
    };

    return (
        <LoginModalContainer style={{ display: isShow ? "block" : "none" }}>
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
                            name="user" 
                            size={32} 
                            color={Colors.mainBlue}
                        />
                    </div>
                    <Text
                        text={t("login")}
                        textSize="twentyFour"
                        color={Colors.textBlack}
                        fontWeight="600"
                        lineHeight={28}
                    />
                    <Text
                        text={t("loginSubtitle")}
                        textSize="fourteen"
                        color={Colors.textGray}
                        lineHeight={20}
                    />
                </div>

                <div className="form">
                    <div className="inputGroup">
                        <label className="label">
                            <DynamicIcon 
                                name="mail" 
                                size={16} 
                                color={Colors.textGray}
                            />
                            <Text
                                text={t("email")}
                                textSize="fourteen"
                                color={Colors.textGray}
                                fontWeight="500"
                            />
                        </label>
                        <input
                            type="email"
                            className="input"
                            placeholder={t("enterEmail")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                                text={t("password")}
                                textSize="fourteen"
                                color={Colors.textGray}
                                fontWeight="500"
                            />
                        </label>
                        <input
                            type="password"
                            className="input"
                            placeholder={t("enterPassword")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>

                    {error && (
                        <div className="errorMessage">
                            <DynamicIcon 
                                name="alert-circle" 
                                size={16} 
                                color={Colors.error}
                            />
                            <Text
                                text={error}
                                textSize="fourteen"
                                color={Colors.error}
                            />
                        </div>
                    )}

                    <ButtonComp
                        title={isLoading ? "" : t("login")}
                        primary
                        onPress={handleLogin}
                        disabled={isLoading}
                        icon={isLoading ? <Spin size="small" /> : undefined}
                    />
                </div>

                <div className="footer">
                    <Text
                        text={t("dontHaveAccount")}
                        textSize="fourteen"
                        color={Colors.textGray}
                    />
                    <button 
                        className="registerLink"
                        onClick={() => {
                            handleClose();
                            visibleStore.show("registerModal");
                        }}
                    >
                        <Text
                            text={t("register")}
                            textSize="fourteen"
                            color={Colors.mainBlue}
                            fontWeight="600"
                        />
                    </button>
                </div>
            </div>
        </LoginModalContainer>
    );
};

export default observer(LoginModal);

const LoginModalContainer = styled.div`
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

    .errorMessage {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background-color: ${Colors.error}10;
        border: 1px solid ${Colors.error}30;
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

    .registerLink {
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
