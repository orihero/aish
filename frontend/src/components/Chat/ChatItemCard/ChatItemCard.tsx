import React, { FC } from "react";
import styled from "styled-components";
import Avatar from "../../Avatar/Avatar";
import Text from "../../Text/Text";
import { Colors } from "../../../shared/utils/color";
import { observer } from "mobx-react-lite";
import { ChatType } from "../../../types";
import { formatDateSmart } from "../../../shared/helper/date";

type Props = {
    chat: ChatType;
    onPress?: () => void;
    selected?: boolean;
};

const ChatItemCard: FC<Props> = ({ chat, onPress, selected }) => {
    return (
        <ChatItemCardContainer
            onClick={onPress}
            style={{
                backgroundColor: selected ? Colors.light : Colors.transparent,
            }}
        >
            <div className="avatar">
                <Avatar
                    imageUrl={chat?.application?.job.company.logo}
                    firstName="A"
                    lastName="S"
                    textColor={Colors.mainBlue}
                    backgroundColor={Colors.mainBlueLight}
                />
            </div>
            <div className="info">
                <div className="title">
                    <Text
                        text={
                            chat?.application?.job?.title.length > 22
                                ? chat?.application?.job?.title.slice(0, 25) +
                                  "..."
                                : chat?.application?.job?.title || "Assistant"
                        }
                        textSize="fourteen"
                        color={Colors.textBlack}
                        paddingTop="3px"
                    />
                    <Text
                        text={formatDateSmart(
                            chat?.messages[chat.messages.length - 1]?.timestamp
                        )}
                        textSize="fourteen"
                        color={Colors.textGray}
                    />
                </div>
                <Text
                    text={chat?.application?.job?.company?.name}
                    textSize="twelve"
                    color={Colors.textColor}
                />
                {/* <Text
                    text={chat?.status}
                    textSize="twelve"
                    color={Colors.textGray}
                /> */}
            </div>
        </ChatItemCardContainer>
    );
};

export default observer(ChatItemCard);

const ChatItemCardContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 10px;
    cursor: pointer;

    .info {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
    }
    .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
    }
`;
