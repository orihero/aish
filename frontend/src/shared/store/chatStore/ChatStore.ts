import { makeAutoObservable, runInAction, toJS } from "mobx";
import { AppRootStore } from "../store";
import APIs from "../../api/api";
import { ChatType } from "../../../types";
// import i18n from "../../translations";
import { nanoid } from "nanoid";

export class ChatStore {
    private readonly rootStore: AppRootStore;
    constructor(root: AppRootStore) {
        makeAutoObservable(this);
        this.rootStore = root;
    }

    myChats: ChatType[] = [];
    currentChat: ChatType = {} as ChatType;
    newMessage: string = "";

    // Loading states
    sendMessageLoading: boolean = false;
    getChatsLoading: boolean = false;
    getChatLoading: boolean = false;

    // Cache management
    private chatsLoaded: boolean = false;
    private chatCache: Map<string, ChatType> = new Map();
    private lastChatsFetch: number = 0;
    private lastChatFetch: Map<string, number> = new Map();
    
    // Cache TTL (Time To Live) in milliseconds
    private readonly CHATS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
    private readonly CHAT_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

    setNewMessage = (text: string) => {
        runInAction(() => {
            this.newMessage = text;
        });
    };

    getMyChats = async (forceRefresh: boolean = false) => {
        const now = Date.now();
        const isCacheValid = this.chatsLoaded && 
            (now - this.lastChatsFetch) < this.CHATS_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            return;
        }

        try {
            runInAction(() => {
                this.getChatsLoading = true;
            });
            
            const chats = await APIs.chats.getMyChats();
            
            runInAction(() => {
                this.myChats = chats.data;
                this.chatsLoaded = true;
                this.lastChatsFetch = now;
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

    getChatById = async (chatId: string, forceRefresh: boolean = false) => {
        const now = Date.now();
        const lastFetch = this.lastChatFetch.get(chatId) || 0;
        const isCacheValid = this.chatCache.has(chatId) && 
            (now - lastFetch) < this.CHAT_CACHE_TTL;

        // Return cached data if valid and not forcing refresh
        if (isCacheValid && !forceRefresh) {
            runInAction(() => {
                this.currentChat = this.chatCache.get(chatId)!;
            });
            return;
        }

        try {
            runInAction(() => {
                this.getChatLoading = true;
            });
            
            const chat = await APIs.chats.getChatById(chatId);
            
            runInAction(() => {
                if (chat.data) {
                    this.currentChat = chat.data;
                    this.chatCache.set(chatId, chat.data);
                    this.lastChatFetch.set(chatId, now);
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
                // Update cache with new messages
                this.chatCache.set(chatId, this.currentChat);
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

    // Cache management methods
    clearCache = () => {
        this.chatCache.clear();
        this.lastChatFetch.clear();
        this.chatsLoaded = false;
        this.lastChatsFetch = 0;
    };

    invalidateChatCache = (chatId: string) => {
        this.chatCache.delete(chatId);
        this.lastChatFetch.delete(chatId);
    };

    invalidateChatsCache = () => {
        this.chatsLoaded = false;
        this.lastChatsFetch = 0;
    };

    // Force refresh methods for when user explicitly wants fresh data
    refreshChats = () => this.getMyChats(true);
    refreshChat = (chatId: string) => this.getChatById(chatId, true);
}
