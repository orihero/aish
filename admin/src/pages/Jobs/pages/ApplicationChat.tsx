import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Message, Chat } from '@/stores/chat.store';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import CompanyAvatar from '@/components/CompanyAvatar';
import { useAuthStore } from '@/stores/auth.store';

export const ApplicationChat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();
  
  // Determine if current user is an employer
  const isEmployer = user?.role === 'employer' || user?.role === 'admin';

  // Helper function to render HTML content safely
  const renderHTMLContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Helper function to get sender name
  const getSenderName = (msg: Message) => {
    if (msg.role === 'assistant') {
      return 'AI Recruiter';
    }
    if (isEmployer) {
      // For employers, show candidate name instead of "You"
      return chat?.candidate 
        ? `${chat.candidate.firstName} ${chat.candidate.lastName}`.trim()
        : 'Candidate';
    }
    return 'You';
  };

  // Helper function to determine message alignment and styling
  const getMessageStyles = (msg: Message) => {
    if (isEmployer) {
      // For employer view: reverse the layout
      return {
        alignment: msg.role === 'assistant' ? 'right' : 'left',
        bgColor: msg.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-100',
        textColor: msg.role === 'assistant' ? 'text-white' : 'text-gray-900'
      };
    } else {
      // For employee view: normal layout
      return {
        alignment: msg.role === 'user' ? 'right' : 'left',
        bgColor: msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-100',
        textColor: msg.role === 'user' ? 'text-white' : 'text-gray-900'
      };
    }
  };

  const { data: chats, isLoading: isChatsLoading, error: chatsError } = useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await api.get('/chats');
      return data;
    },
  });

  const { data: chat, isLoading: isChatLoading, error: chatError } = useQuery<Chat>({
    queryKey: ['chat', chatId],
    queryFn: async () => {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }
      const { data } = await api.get(`/chats/${chatId}`);
      return data;
    },
    enabled: !!chatId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }
      const { data } = await api.post(`/chats/${chatId}/messages`, { message });
      return data;
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['chat', chatId] });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData<Chat>(['chat', chatId]);

      // Optimistically update to the new value
      if (previousChat) {
        const optimisticChat = {
          ...previousChat,
          messages: [
            ...previousChat.messages,
            {
              _id: Date.now().toString(),
              role: isEmployer ? 'assistant' : 'user',
              content: newMessage,
              timestamp: new Date().toISOString()
            }
          ]
        };
        queryClient.setQueryData(['chat', chatId], optimisticChat);
      }

      // Return a context object with the snapshotted value
      return { previousChat };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousChat) {
        queryClient.setQueryData(['chat', chatId], context.previousChat);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['chat', chatId] });
    },
  });

  const filteredChats = chats?.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    return (
      chat.candidate?.firstName?.toLowerCase().includes(searchLower) ||
      chat.candidate?.lastName?.toLowerCase().includes(searchLower) ||
      chat.application?.job?.title?.toLowerCase().includes(searchLower) ||
      chat.application?.job?.company?.name?.toLowerCase().includes(searchLower) ||
      chat.messages[chat.messages.length - 1]?.content.toLowerCase().includes(searchLower)
    );
  });

  // Only show full-page loader when loading the initial chats list
  if (isChatsLoading) {
    return <LoadingSpinner />;
  }

  if (chatsError) {
    return <ErrorMessage message="Failed to load chats" />;
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex m-6">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col h-full rounded-l-lg shadow-lg">
        {/* Profile and Search */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <CompanyAvatar name="Admin" size="md" />
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search contact or start a new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-gray-100 rounded-full text-sm"
              />
              <svg
                className="absolute left-2 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Chats Section */}
          <h2 className="text-lg font-medium text-indigo-500 mb-4">Chats</h2>
        </div>

        {/* Chat List with Scroll */}
        <div className="overflow-y-auto flex-1 h-0">
          <div className="divide-y divide-gray-100">
            {filteredChats?.map((chat) => (
              <ChatPreview
                key={chat._id}
                companyName={chat.application?.job?.company?.name || 'Unknown Company'}
                companyLogo={chat.application?.job?.company?.logo}
                jobTitle={chat.application?.job?.title}
                message={chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                date={new Date(chat.updatedAt).toLocaleDateString('ru-RU', {
                  month: 'short',
                  day: 'numeric'
                })}
                unread={0}
                onClick={() => navigate(`/chats/${chat._id}`)}
              />
            ))}
            {filteredChats?.length === 0 && (
              <div className="text-center text-gray-500 py-4">No chats found</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50 rounded-r-lg h-full shadow-lg">
        {!chatId ? (
          <div className="flex-1 flex items-center justify-center bg-pattern">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <button className="px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 hover:bg-gray-50">
                Start Conversation
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages Area with Scroll */}
            <div className="flex-1 overflow-y-auto h-0">
              <div className="p-4 space-y-4">
                {isChatLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                ) : chatError ? (
                  <div className="text-center text-red-500 py-4">Failed to load chat messages</div>
                ) : (
                  <>
                    {chat?.messages.map((msg: Message) => {
                      const styles = getMessageStyles(msg);
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${styles.alignment === 'right' ? 'justify-end' : 'justify-start'} mb-4`}
                        >
                          <div
                            className={`max-w-[70%] p-4 rounded-lg ${styles.bgColor} ${styles.textColor}`}
                          >
                            <p className={`text-sm ${styles.textColor === 'text-white' ? 'text-blue-100' : 'text-gray-600'}`}>
                              {getSenderName(msg)}
                            </p>
                            <div className="mt-1">
                              {renderHTMLContent(msg.content)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {sendMessageMutation.isPending && (
                      <div className={`flex ${isEmployer ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div className="max-w-[70%] p-4 bg-blue-500 rounded-lg">
                          <p className="text-sm text-blue-100">AI Recruiter</p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Fixed Input Area */}
            <div className="p-6 bg-white border-t rounded-br-lg">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (message.trim()) {
                    sendMessageMutation.mutate(message);
                    setMessage('');
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm"
                />
                <button
                  type="submit"
                  disabled={sendMessageMutation.isPending}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 disabled:opacity-50"
                >
                  {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface ChatPreviewProps {
  companyName: string;
  companyLogo?: string;
  jobTitle?: string;
  message: string;
  date: string;
  unread: number;
  onClick: () => void;
}

const ChatPreview = ({
  companyName,
  companyLogo,
  jobTitle,
  message,
  date,
  unread,
  onClick,
}: ChatPreviewProps) => {
  return (
    <div
      onClick={onClick}
      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
    >
      <div className="flex items-center gap-3">
        <CompanyAvatar name={companyName} logo={companyLogo} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">{companyName}</h3>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          {jobTitle && (
            <p className="text-sm text-gray-500 truncate">{jobTitle}</p>
          )}
          <p className="text-sm text-gray-600 truncate">{message}</p>
        </div>
        {unread > 0 && (
          <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">{unread}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationChat;
