import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import ButtonComp from "../Button/Button";
import { useTranslation } from "react-i18next";
import useRootStore from "../../shared/hooks/UseRootStore";
import { UpdateProfileType } from "../../types";
import { message } from "antd";

type Props = {
    isShow?: boolean;
};

const EditPersonalInfoModal: FC<Props> = ({ isShow }) => {
    const { t } = useTranslation();
    const { authStore, visibleStore } = useRootStore();
    const [formData, setFormData] = useState<UpdateProfileType>({
        firstName: "",
        lastName: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<UpdateProfileType>>({});

    useEffect(() => {
        if (isShow && authStore.user) {
            setFormData({
                firstName: authStore.user.firstName || "",
                lastName: authStore.user.lastName || "",
                phone: authStore.user.phone || "",
            });
            setErrors({});
        }
    }, [isShow, authStore.user]);

    const validateForm = (): boolean => {
        const newErrors: Partial<UpdateProfileType> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = t("firstNameRequired");
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t("lastNameRequired");
        }

        // Phone is optional, but if provided, it must be valid
        if (formData.phone && formData.phone.trim() && !/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ""))) {
            newErrors.phone = t("invalidPhoneNumber");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof UpdateProfileType, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Only include phone if it has a value
            const updateData: UpdateProfileType = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                ...(formData.phone && formData.phone.trim() && { phone: formData.phone.trim() })
            };
            
            await authStore.updateProfile(updateData);
            message.success(t("profileUpdatedSuccessfully"));
            visibleStore.hide("editPersonalInfoModal");
        } catch (error: any) {
            console.error("Profile update error:", error);
            message.error(error.response?.data?.message || t("profileUpdateFailed"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        visibleStore.hide("editPersonalInfoModal");
        setFormData({
            firstName: "",
            lastName: "",
            phone: "",
        });
        setErrors({});
    };

    if (!isShow) return null;

    return (
        <ModalOverlay onClick={handleClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <Text
                        text={t("editPersonalInformation")}
                        textSize="twenty"
                        color={Colors.textBlack}
                        family="Epilogue-SemiBold"
                    />
                    <button className="closeButton" onClick={handleClose}>
                        ×
                    </button>
                </ModalHeader>

                <ModalBody>
                    <div className="formGroup">
                        <Text
                            text={t("firstName")}
                            textSize="fourteen"
                            color={Colors.textGray}
                            family="Epilogue-Medium"
                        />
                        <input
                            type="text"
                            className="input"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder={t("enterFirstName")}
                        />
                        {errors.firstName && (
                            <Text
                                text={errors.firstName}
                                textSize="twelve"
                                color={Colors.tomato}
                                family="Epilogue-Regular"
                            />
                        )}
                    </div>

                    <div className="formGroup">
                        <Text
                            text={t("lastName")}
                            textSize="fourteen"
                            color={Colors.textGray}
                            family="Epilogue-Medium"
                        />
                        <input
                            type="text"
                            className="input"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder={t("enterLastName")}
                        />
                        {errors.lastName && (
                            <Text
                                text={errors.lastName}
                                textSize="twelve"
                                color={Colors.tomato}
                                family="Epilogue-Regular"
                            />
                        )}
                    </div>

                    <div className="formGroup">
                        <Text
                            text={`${t("phoneNumber")} (${t("optional")})`}
                            textSize="fourteen"
                            color={Colors.textGray}
                            family="Epilogue-Medium"
                        />
                        <input
                            type="tel"
                            className="input"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder={t("enterPhoneNumber")}
                        />
                        {errors.phone && (
                            <Text
                                text={errors.phone}
                                textSize="twelve"
                                color={Colors.tomato}
                                family="Epilogue-Regular"
                            />
                        )}
                    </div>

                    <div className="formGroup">
                        <Text
                            text={t("email")}
                            textSize="fourteen"
                            color={Colors.textGray}
                            family="Epilogue-Medium"
                        />
                        <input
                            type="email"
                            className="input disabled"
                            value={authStore.user?.email || ""}
                            disabled
                            placeholder={t("email")}
                        />
                        <Text
                            text={t("emailCannotBeChanged")}
                            textSize="twelve"
                            color={Colors.textGray}
                            family="Epilogue-Regular"
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <ButtonComp
                        title={t("cancel")}
                        onPress={handleClose}
                        className="cancelButton"
                    />
                    <ButtonComp
                        title={t("saveChanges")}
                        primary
                        onPress={handleSubmit}
                        disabled={isLoading}
                        className="saveButton"
                    />
                </ModalFooter>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default EditPersonalInfoModal;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContainer = styled.div`
    background-color: ${Colors.white};
    border-radius: 15px;
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid ${Colors.lineColor};

    .closeButton {
        background: none;
        border: none;
        font-size: 24px;
        color: ${Colors.textGray};
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;

        &:hover {
            background-color: ${Colors.lineColor};
            color: ${Colors.textBlack};
        }
    }
`;

const ModalBody = styled.div`
    padding: 25px;

    .formGroup {
        margin-bottom: 20px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid ${Colors.lineColor};
        border-radius: 8px;
        font-size: 14px;
        font-family: 'Epilogue-Regular', sans-serif;
        color: ${Colors.textBlack};
        background-color: ${Colors.white};
        transition: all 0.2s ease;
        margin-top: 8px;

        &:focus {
            outline: none;
            border-color: ${Colors.mainBlue};
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        &.disabled {
            background-color: ${Colors.light};
            color: ${Colors.textGray};
            cursor: not-allowed;
        }

        &::placeholder {
            color: ${Colors.textGray};
        }
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding: 20px 25px;
    border-top: 1px solid ${Colors.lineColor};

    .cancelButton {
        background-color: ${Colors.lineColor};
        color: ${Colors.textBlack};
        
        &:hover {
            background-color: ${Colors.textGray};
            color: ${Colors.white};
        }
    }

    .saveButton {
        min-width: 120px;
    }
`;
