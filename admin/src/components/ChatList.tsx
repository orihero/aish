import { Chat } from '../types/chat';
import { useNavigate } from 'react-router-dom';

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

export const ChatList = ({ chats, isLoading, error }: ChatListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-4">Loading chats...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (chats.length === 0) {
    return <div className="text-center py-4">No chats found</div>;
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate(`/chats/${chat._id}`)}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{chat.title || 'Untitled Chat'}</h3>
            <span className="text-sm text-gray-500">
              {new Date(chat.updatedAt).toLocaleDateString()}
            </span>
          </div>
          {chat.lastMessage && (
            <p className="text-sm text-gray-600 mt-2 truncate">
              {chat.lastMessage.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}; 