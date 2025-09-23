import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { User, Bot, FileText, Briefcase } from 'lucide-react';

interface ChatProps {
  chatId: string;
}

export const Chat = ({ chatId }: ChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const { currentChat, isLoading, getChat, sendMessage } = useChatStore();
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Determine if current user is an employer
  const isEmployer = user?.role === 'employer' || user?.role === 'admin';

  // Helper function to render HTML content safely
  const renderHTMLContent = (content: string) => {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  // Helper function to get sender name
  const getSenderName = (message: any) => {
    if (message.role === 'assistant') {
      return 'AI Recruiter';
    }
    if (isEmployer) {
      // For employers, show candidate name instead of "You"
      return currentChat?.candidate 
        ? `${currentChat.candidate.firstName} ${currentChat.candidate.lastName}`.trim()
        : 'Candidate';
    }
    return 'You';
  };

  // Helper function to determine message alignment and styling
  const getMessageStyles = (message: any) => {
    if (isEmployer) {
      // For employer view: reverse the layout
      return {
        alignment: message.role === 'assistant' ? 'right' : 'left',
        bgColor: message.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-100',
        textColor: message.role === 'assistant' ? 'text-white' : 'text-gray-900'
      };
    } else {
      // For employee view: normal layout
      return {
        alignment: message.role === 'user' ? 'right' : 'left',
        bgColor: message.role === 'user' ? 'bg-blue-500' : 'bg-gray-100',
        textColor: message.role === 'user' ? 'text-white' : 'text-gray-900'
      };
    }
  };

  useEffect(() => {
    getChat(chatId);
  }, [chatId, getChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(chatId, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageIcon = (role: string) => {
    return role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getMessageTypeBadge = (messageType?: string) => {
    if (!messageType || messageType === 'normal') return null;
    
    const badgeConfig = {
      apply: { label: 'Application', variant: 'outline' as const, icon: <FileText className="w-3 h-3 mr-1" /> },
      vacancy_ready: { label: 'Ready', variant: 'success' as const, icon: <Briefcase className="w-3 h-3 mr-1" /> },
      vacancy_creation_start: { label: 'Start', variant: 'default' as const, icon: <Briefcase className="w-3 h-3 mr-1" /> },
      vacancy_creation_progress: { label: 'Progress', variant: 'secondary' as const, icon: <Briefcase className="w-3 h-3 mr-1" /> },
      vacancy_creation_complete: { label: 'Complete', variant: 'success' as const, icon: <Briefcase className="w-3 h-3 mr-1" /> }
    };

    const config = badgeConfig[messageType as keyof typeof badgeConfig];
    if (!config) return null;

    return (
      <Badge variant={config.variant} className="ml-2 text-xs">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const renderMessageContent = (message: any) => {
    // Special handling for apply message type
    if (message.messageType === 'apply') {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-sm">Application Submitted</span>
          </div>
          <div className="text-xs text-gray-600">
            Applied to: {message.metadata?.vacancyTitle || 'Position'}
          </div>
          <div className="text-xs text-gray-600">
            Resume: {message.metadata?.resumeName || 'Resume'}
          </div>
        </div>
      );
    }

    // Render HTML content for normal messages
    return renderHTMLContent(message.content);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat.messages.map((message) => {
          const styles = getMessageStyles(message);
          return (
            <div
              key={message._id}
              className={`flex ${styles.alignment === 'right' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${styles.bgColor} ${styles.textColor}`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getMessageIcon(message.role)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs mb-1 ${styles.textColor === 'text-white' ? 'text-blue-100' : 'text-gray-600'}`}>
                      {getSenderName(message)}
                    </p>
                    {renderMessageContent(message)}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                      {getMessageTypeBadge(message.messageType)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
}; 