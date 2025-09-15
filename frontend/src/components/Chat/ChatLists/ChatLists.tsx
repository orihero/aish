import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChatItemCard from "../ChatItemCard/ChatItemCard";
import { observer } from "mobx-react-lite";
import useRootStore from "../../../shared/hooks/UseRootStore";
import { Colors } from "../../../shared/utils/color";
import Text from "../../Text/Text";
import IconComp from "../../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import SpinLoading from "../../SpinLoading/SpinLoading";
import { useTranslation } from "react-i18next";

interface Chat {
    id: string;
    name: string;
}

const ChatList: React.FC = () => {
    const navigation = useNavigate();
    const { chatStore } = useRootStore();
    const { t } = useTranslation();

    const { id: selectedId } = useParams<{ id?: string }>();

    // Load chats on component mount (will use cache if available)
    useEffect(() => {
        chatStore.getMyChats();
    }, [chatStore]);

    const onChatHandle = useCallback(
        (chatId: string) => {
            navigation(`/chat/${chatId}`);
            chatStore.getChatById(chatId);
        },
        [navigation, chatStore]
    );

    const renderChats = useCallback(() => {
        if (chatStore.getChatsLoading) {
            return <SpinLoading size="large" />;
        }
        return chatStore.myChats.map((chat) => (
            <div key={chat._id}>
                <ChatItemCard
                    chat={chat}
                    onPress={() => onChatHandle(chat._id)}
                    selected={selectedId === chat._id}
                />
                <div className="line"></div>
            </div>
        ));
    }, [
        chatStore.getChatsLoading,
        chatStore.myChats,
        onChatHandle,
        selectedId,
    ]);

    return (
        <Sidebar>
            <div
                className="chatsTitle"
                onClick={() => navigation('/applications')}
            >
                <IconComp icon={<DynamicIcon name="chevron-left" />} />
                <Text
                    text={t("chats")}
                    textSize="twentyTwo"
                    color={Colors.textBlack}
                    paddingTop="3px"
                />
            </div>
            {renderChats()}
        </Sidebar>
    );
};

export default observer(ChatList);

const Sidebar = styled.div`
    border-right: 1px solid ${Colors.lineColor};
    overflow-y: auto;

    .chatsTitle {
        display: flex;
        align-items: center;
        height: 8vh;
        padding: 10px;
        background-color: ${Colors.mainBlueLight};
        gap: 10px;
    }
    .line {
        width: 100%;
        height: 1px;
        background-color: ${Colors.lineColor};
    }
`;
