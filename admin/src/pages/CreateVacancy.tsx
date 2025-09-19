import { useState } from 'react';
import { VacancyCreationChat } from '../components/VacancyCreationChat';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, MessageSquare, FileText } from 'lucide-react';

export const CreateVacancy = () => {
  const [creationMode, setCreationMode] = useState<'chat' | 'form'>('chat');
  const [createdVacancy, setCreatedVacancy] = useState<any>(null);

  const handleVacancyCreated = (vacancy: any) => {
    setCreatedVacancy(vacancy);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Vacancy</h1>
        <p className="text-gray-600">
          Choose how you'd like to create your vacancy - through our AI assistant or traditional form.
        </p>
      </div>

      {createdVacancy && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Vacancy Created Successfully!</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              "{createdVacancy.title}" has been created and saved as a draft.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mode Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Creation Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant={creationMode === 'chat' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setCreationMode('chat')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant Chat
              </Button>
              <Button
                variant={creationMode === 'form' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setCreationMode('form')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Traditional Form
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">AI Assistant Benefits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Guided conversation to collect all required information</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Smart suggestions based on industry standards</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Automatic formatting and optimization</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                <span>Real-time validation and feedback</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {creationMode === 'chat' ? (
            <VacancyCreationChat onVacancyCreated={handleVacancyCreated} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Traditional Form</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Traditional Form Coming Soon
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We're working on a traditional form interface. For now, please use our AI assistant.
                  </p>
                  <Button onClick={() => setCreationMode('chat')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Use AI Assistant Instead
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
