import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '../stores/chat.store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, MessageSquare, Bot, User } from 'lucide-react';

interface VacancyCreationChatProps {
  onVacancyCreated?: (vacancy: any) => void;
}

export const VacancyCreationChat = ({ onVacancyCreated }: VacancyCreationChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { 
    currentChat, 
    isLoading, 
    error,
    startVacancyCreationChat,
    continueVacancyCreationChat,
    finishVacancyCreation,
    clearError
  } = useChatStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChat) {
      startChat();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages]);

  const startChat = async () => {
    try {
      setIsCreating(true);
      await startVacancyCreationChat();
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      await continueVacancyCreationChat(currentChat._id, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFinishVacancy = async () => {
    if (!currentChat) return;

    try {
      const result = await finishVacancyCreation(currentChat._id);
      if (onVacancyCreated) {
        onVacancyCreated(result.vacancy);
      }
    } catch (error) {
      console.error('Error finishing vacancy creation:', error);
    }
  };

  const getMessageIcon = (role: string) => {
    return role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getMessageTypeBadge = (messageType?: string) => {
    if (!messageType || messageType === 'normal') return null;
    
    const badgeConfig = {
      vacancy_creation_start: { label: 'Start', variant: 'default' as const },
      vacancy_creation_progress: { label: 'Progress', variant: 'secondary' as const },
      vacancy_ready: { label: 'Ready', variant: 'success' as const },
      vacancy_creation_complete: { label: 'Complete', variant: 'success' as const },
      apply: { label: 'Application', variant: 'outline' as const }
    };

    const config = badgeConfig[messageType as keyof typeof badgeConfig];
    if (!config) return null;

    return (
      <Badge variant={config.variant} className="ml-2 text-xs">
        {config.label}
      </Badge>
    );
  };

  const isVacancyReady = currentChat?.messages.some(
    msg => msg.messageType === 'vacancy_ready'
  );

  const isVacancyComplete = currentChat?.messages.some(
    msg => msg.messageType === 'vacancy_creation_complete'
  );

  if (isCreating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Starting vacancy creation chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => { clearError(); startChat(); }}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentChat) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No chat available</p>
            <Button onClick={startChat}>
              Start Vacancy Creation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Vacancy Creation Assistant
          {isVacancyComplete && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat.messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-0.5">
                    {getMessageIcon(message.role)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
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
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          {isVacancyComplete ? (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium mb-2">Vacancy Created Successfully!</p>
              <p className="text-sm text-gray-500 mb-4">
                Your vacancy has been created and saved as a draft.
              </p>
              <Button onClick={() => window.location.reload()}>
                Create Another Vacancy
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Describe your vacancy requirements..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                  Send
                </Button>
              </div>
              
              {isVacancyReady && (
                <div className="text-center">
                  <Button 
                    onClick={handleFinishVacancy}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Finish & Create Vacancy
                  </Button>
                </div>
              )}
            </form>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
