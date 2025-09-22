import { observer } from "mobx-react-lite";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import useRootStore from "../../../shared/hooks/UseRootStore";
import { toJS } from "mobx";
import IconComp from "../../../shared/constants/iconBtn";
import { DynamicIcon } from "lucide-react/dynamic";
import Text from "../../Text/Text";
import { Colors } from "../../../shared/utils/color";
import { useNavigate } from "react-router-dom";
import Avatar from "../../Avatar/Avatar";
import { formatDateSmart, formatTime } from "../../../shared/helper/date";
import { Skeleton } from "antd";
import SpinLoading from "../../SpinLoading/SpinLoading";
import { useTranslation } from "react-i18next";

interface ChatDetailProps {
    chatId: string;
}

interface MessageProps {
    from: "user" | "bot";
    text: string;
}

interface MessageStyleProps {
    from: "assistant" | "user";
}

// 🔼 imports and other code remain unchanged

const ChatDetail: React.FC<ChatDetailProps> = ({ chatId }) => {
    const { chatStore } = useRootStore();
    const navigation = useNavigate();
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState<string>("");
    console.log("currentChat", toJS(chatStore.currentChat));

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const chatMessages = useMemo(() => {
        return chatStore.currentChat || [];
    }, [chatStore.currentChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatId, chatMessages]);

    useEffect(() => {
        if (!chatId) return;
        chatStore.getChatById(chatId);
    }, [chatId, chatStore]);

    const onSetNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        chatStore.setNewMessage(e.target.value);
    };

    const sendMessage = () => {
        if (newMessage.trim()) {
            chatStore.sendMessage(chatMessages?.application.chat as never);
            setNewMessage("");
        }
    };

    const renderMessages = useCallback(() => {
        return (
            <>
                {chatStore.getChatLoading ? (
                    <SpinLoading size="large" />
                ) : chatMessages?.messages?.length === 0 ? (
                    <Text
                        text={t("noMessagesYet")}
                        textSize="fourteen"
                        color={Colors.textGray}
                        family="Epilogue-Regular"
                    />
                ) : (
                    chatMessages?.messages?.map((msg, i) => (
                        <Message key={i} from={msg?.role}>
                            <Text
                                text={msg?.content}
                                textSize="fourteen"
                                color={
                                    msg.role === "user"
                                        ? Colors.white
                                        : Colors.textBlack
                                }
                                family="Epilogue-Regular"
                                lineHeight={18}
                            />
                            <Text
                                text={formatTime(msg?.timestamp)}
                                textSize="twelve"
                                color={
                                    msg.role === "user"
                                        ? Colors.textGray
                                        : Colors.lightGray
                                }
                                family="Epilogue-Regular"
                                className="time"
                            />
                        </Message>
                    ))
                )}
                {chatStore.sendMessageLoading && <SpinLoading size="large" />}
                <div ref={messagesEndRef} />
            </>
        );
    }, [
        chatMessages?.messages,
        chatStore.getChatLoading,
        chatStore.sendMessageLoading,
    ]);

    return (
        <ChatWindow>
            <div className="chatsTitle" onClick={() => navigation(-1)}>
                <Avatar
                    imageUrl={chatMessages?.application?.job.company.logo}
                    firstName="A"
                    lastName="S"
                    textColor={Colors.mainBlue}
                    backgroundColor={Colors.mainBlueLight}
                    size={40}
                    textSize="twentyTwo"
                />
                <Text
                    text={
                        chatMessages?.application?.job?.company?.name ||
                        t("assistant")
                    }
                    textSize="eighteen"
                    color={Colors.textBlack}
                    paddingTop="3px"
                />
            </div>
            <Messages>{renderMessages()}</Messages>
            <InputWrapper>
                <IconComp
                    icon={
                        <DynamicIcon name="paperclip" color={Colors.textGray} />
                    }
                    onClick={sendMessage}
                />
                <Input
                    value={newMessage}
                    onChange={(e) => onSetNewMessage(e)}
                    placeholder={t("typeMessage")}
                />

                <IconComp
                    icon={<DynamicIcon name="send" color={Colors.mainBlue} />}
                    disabled={!newMessage.trim().length}
                    onClick={sendMessage}
                />
            </InputWrapper>
        </ChatWindow>
    );
};

export default observer(ChatDetail);

const ChatWindow = styled.div`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow-y: auto;

    .chatsTitle {
        display: flex;
        align-items: center;
        height: 8vh;
        padding: 10px;
        background-color: ${Colors.mainBlueLight};
        gap: 10px;
    }
`;

const Messages = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Message = styled.div<MessageStyleProps>`
    position: relative;
    margin-bottom: 10px;
    align-self: ${({ from }) => (from === "user" ? "flex-end" : "flex-start")};
    background-color: ${({ from }) =>
        from === "user" ? Colors.mainBlue : Colors.light};
    padding: 10px 10px 15px 10px;
    border-radius: 10px;
    max-width: 80%;

    .time {
        position: absolute;
        bottom: 2px;
        right: 5px;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    margin-top: 10px;
    border-top: 1px solid ${Colors.lineColor};
    padding: 0 20px;
`;

const Input = styled.input`
    flex: 1;
    padding: 20px 10px;
    border: none;
    outline: none;
`;
