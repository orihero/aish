import React, { FC } from "react";
import { UserFullType } from "../../types";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import Avatar from "../Avatar/Avatar";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslation } from "react-i18next";
import useRootStore from "../../shared/hooks/UseRootStore";
import { useNavigate } from "react-router-dom";

type Props = {
    user: UserFullType;
    onPress?: () => void;
};

const PersonalInfoCard: FC<Props> = ({ user, onPress }) => {
    const { t } = useTranslation();
    const { authStore, visibleStore } = useRootStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authStore.logout();
        navigate("/"); // Redirect to home page after logout
    };

    const handleEditClick = () => {
        visibleStore.show("editPersonalInfoModal");
    };

    return (
        <PersonalInfoCardContainer onClick={onPress}>
            <div className="info">
                <div className="item">
                    <Text
                        text={t("firstName")}
                        textSize="sixteen"
                        color={Colors.textGray}
                    />
                    <Text
                        text={user.firstName}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
                <div className="item">
                    <Text
                        text={t("lastName")}
                        textSize="sixteen"
                        color={Colors.textGray}
                    />
                    <Text
                        text={user.lastName}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
                <div className="item">
                    <Text
                        text={t("email")}
                        textSize="sixteen"
                        color={Colors.textGray}
                    />
                    <Text
                        text={user.email}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
                <div className="item">
                    <Text
                        text={t("phoneNumber")}
                        textSize="sixteen"
                        color={Colors.textGray}
                    />
                    <Text
                        text={user.phone ? user.phone : t("notProvided")}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
            </div>
            <div className="rightBox">
                {/* <IconComp 
                    icon={<DynamicIcon name="edit" />} 
                    onClick={handleEditClick}
                    className="editIcon"
                    
                /> */}
                <IconComp 
                    icon={<DynamicIcon name="log-out" color={Colors.tomato} />} 
                    onClick={handleLogout}
                    className="logoutIcon"
                />
            </div>
        </PersonalInfoCardContainer>
    );
};

export default observer(PersonalInfoCard);

const PersonalInfoCardContainer = styled.div`
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
    .info {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .rightBox {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .editIcon {
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }

    .logoutIcon {
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }

    .username {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;
