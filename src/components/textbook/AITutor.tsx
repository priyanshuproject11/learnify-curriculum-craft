
import { useState } from "react";
import { DikshaTextbook } from "@/types/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Book, HelpCircle, ArrowLeft, FilePlus } from "lucide-react";
import { toast } from "sonner";

interface AITutorProps {
  textbook: DikshaTextbook;
}

const AITutor = ({ textbook }: AITutorProps) => {
  const [mode, setMode] = useState<'explain' | 'question' | 'help' | 'practice'>('explain');
  
  const handleAskQuestion = () => {
    toast.info("AI Tutor is analyzing your question...", {
      description: "This feature is coming soon!"
    });
  };

  return (
    <Card className="bg-gradient-to-br from-lms-purple/20 to-lms-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Math Tutor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          Currently viewing: <span className="font-medium">{textbook.name}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setMode('explain')}
          >
            <Book className="h-4 w-4" />
            Explain Page
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setMode('question')}
          >
            <HelpCircle className="h-4 w-4" />
            Ask Question
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setMode('help')}
          >
            <Brain className="h-4 w-4" />
            Need Help?
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setMode('practice')}
          >
            <FilePlus className="h-4 w-4" />
            Try Example
          </Button>
        </div>

        <div className="mt-4 p-4 bg-white/60 rounded-lg">
          <p className="text-sm text-gray-600">
            {mode === 'explain' && "I'll help explain the current page content step by step..."}
            {mode === 'question' && "Ask me any question about the current topic..."}
            {mode === 'help' && "I'll break down complex concepts with examples..."}
            {mode === 'practice' && "Let's solve some practice problems together..."}
          </p>
          
          {mode !== 'explain' && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3"
              onClick={() => setMode('explain')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Page
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AITutor;
