import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AppRootStore } from "../store";
import APIs from "../../api/api";
import { ChatType } from "../../../types";
// import i18n from "../../translations";
import { customAlphabet, nanoid } from "nanoid";

export class ChatStore {
    private readonly rootStore: AppRootStore;
    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }

    myChats: ChatType[] = [];

    currentChat: ChatType = {} as ChatType;

    newMessage: string = "";

    sendMessageLoading: boolean = false;

    getChatsLoading: boolean = false;
    getChatLoading: boolean = false;

    setNewMessage = (text: string) => {
        runInAction(() => {
            this.newMessage = text;
        });
    };

    getMyChats = async () => {
        try {
            runInAction(() => {
                this.getChatsLoading = true;
            });
            const chats = await APIs.chats.getMyChats();
            runInAction(() => {
                this.myChats = chats.data;
                this.getChatsLoading = false;
            });
            console.log("chats", toJS(chats?.data));
        } catch (error) {
            console.log("error", error);
        } finally {
            runInAction(() => {
                this.getChatsLoading = false;
            });
        }
    };

    getChatById = async (chatId: string) => {
        try {
            runInAction(() => {
                this.getChatLoading = true;
            });
            const chat = await APIs.chats.getChatById(chatId);
            runInAction(() => {
                if (chat.data) {
                    this.currentChat = chat.data;
                    this.getChatLoading = false;
                }
            });
        } catch (error) {
            console.log("error", error);
        } finally {
            runInAction(() => {
                this.getChatLoading = false;
            });
        }
    };

    sendMessage = async (chatId: string) => {
        try {
            runInAction(() => {
                this.sendMessageLoading = true;
                this.currentChat = {
                    ...this.currentChat,
                    messages: [
                        ...this.currentChat.messages,
                        {
                            role: "user",
                            content: this.newMessage,
                            timestamp: new Date().toISOString(),
                            _id: nanoid(24),
                        },
                    ],
                };
            });
            const message = await APIs.chats.sendMessage(
                chatId,
                this.newMessage
            );
            runInAction(() => {
                this.newMessage = "";
            });
            runInAction(() => {
                this.currentChat = {
                    ...this.currentChat,
                    messages: message.data.messages,
                };
                this.sendMessageLoading = false;
            });
        } catch (error) {
            console.log("error", error);
        } finally {
            runInAction(() => {
                this.sendMessageLoading = false;
            });
        }
    };
}
