import React, { FC } from "react";
import { UserFullType } from "../../types";
import { Colors } from "../../shared/utils/color";
import Text from "../Text/Text";
import Avatar from "../Avatar/Avatar";
import { observer } from "mobx-react-lite";
import styled from "styled-components";
import IconComp from "../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";

type Props = {
    user: UserFullType;
    onPress?: () => void;
};

const PersonalInfoCard: FC<Props> = ({ user, onPress }) => {
    return (
        <PersonalInfoCardContainer onClick={onPress}>
            <div className="info">
                <div className="item">
                    <Text
                        text={"First name"}
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
                        text={"Last name"}
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
                        text={"Email"}
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
                        text={"Phone"}
                        textSize="sixteen"
                        color={Colors.textGray}
                    />
                    <Text
                        text={user.phone ? user.phone : "Not provided"}
                        textSize="sixteen"
                        color={Colors.textBlack}
                    />
                </div>
            </div>
            <div className="rightBox">
                <IconComp icon={<DynamicIcon name="edit" />} />
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
        gap: 20px;
    }

    .username {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
`;
