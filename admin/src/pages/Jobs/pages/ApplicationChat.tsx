import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@/components/Alert';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth.store';

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export const ApplicationChat = () => {
  const { applicationId } = useParams();
  const { user } = useAuthStore();

  const { data: chat, isLoading, error } = useQuery({
    queryKey: ['chat', applicationId],
    queryFn: async () => {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      // Get the specific application by ID
      const applicationResponse = await fetch(`${import.meta.env.VITE_API_URL}/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!applicationResponse.ok) {
        throw new Error('Failed to fetch application');
      }
      const application = await applicationResponse.json();

      if (!application.chatId) {
        throw new Error('Chat not found for this application');
      }

      // Get chat by ID using the correct route
      const chatResponse = await fetch(`${import.meta.env.VITE_API_URL}/chats/${application.chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!chatResponse.ok) {
        throw new Error('Failed to fetch chat');
      }
      return chatResponse.json();
    },
  });

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const messageInput = form.elements.namedItem('message') as HTMLInputElement;
    const message = messageInput.value.trim();

    if (!message || !chat?._id) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chats/${chat._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      messageInput.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        {error instanceof Error ? error.message : 'Failed to load chat'}
      </Alert>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Chat Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-semibold">{chat?.application.job.title}</h1>
        <p className="text-sm text-gray-500">{chat?.application.job.company.name}</p>
        <div className="mt-2">
          <span className={`text-sm px-2 py-1 rounded ${chat?.application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            chat?.application.status === 'accepted' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
            {chat?.application.status}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat?.messages.map((message: Message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${message.sender._id === user?.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
                }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}; 