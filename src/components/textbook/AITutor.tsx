
import { useState } from "react";
import { DikshaTextbook } from "@/types/curriculum";
import { TutorMode, TutorQuestion } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Book, HelpCircle, ArrowLeft, FilePlus, Send } from "lucide-react";
import { toast } from "sonner";
import { TUTOR_MODES } from "@/constants/tutorModes";

interface AITutorProps {
  textbook: DikshaTextbook;
}

const AITutor = ({ textbook }: AITutorProps) => {
  const [mode, setMode] = useState<TutorMode['mode']>('explain');
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<TutorQuestion[]>([]);

  const currentMode = TUTOR_MODES.find(m => m.mode === mode)!;

  const handleSendQuestion = async () => {
    if (!question.trim()) return;

    setIsTyping(true);
    const newQuestion: TutorQuestion = {
      question: question.trim(),
      timestamp: new Date(),
      mode
    };

    setConversation(prev => [...prev, newQuestion]);
    
    try {
      // Simulated AI response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info("AI Tutor is ready to help!", {
        description: "This feature is being implemented. For now, you can explore the interface."
      });
    } catch (error) {
      toast.error("Unable to process your question");
    } finally {
      setIsTyping(false);
      setQuestion('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
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
          <div className="font-medium">{textbook.name}</div>
          <div className="text-gray-500">
            Grade: {textbook.gradeLevel?.join(", ")} | Subject: {textbook.subject?.join(", ")}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {TUTOR_MODES.map((tutorMode) => {
            const Icon = {
              'book': Book,
              'help-circle': HelpCircle,
              'brain': Brain,
              'file-plus': FilePlus
            }[tutorMode.icon];

            return (
              <Button 
                key={tutorMode.mode}
                variant={mode === tutorMode.mode ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setMode(tutorMode.mode)}
              >
                <Icon className="h-4 w-4" />
                {tutorMode.label}
              </Button>
            );
          })}
        </div>

        <ScrollArea className="h-[200px] rounded-md border bg-white/60 p-4">
          {conversation.length === 0 ? (
            <div className="text-sm text-gray-600">
              {currentMode.description}
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((q, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium">You asked:</div>
                  <div className="mt-1 text-gray-600">{q.question}</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask a question about ${textbook.name}...`}
            className="min-h-[80px] bg-white/80"
            disabled={isTyping}
          />
          <div className="flex items-center justify-between">
            {mode !== 'explain' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setMode('explain')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Page
              </Button>
            )}
            <Button 
              className="ml-auto"
              onClick={handleSendQuestion}
              disabled={!question.trim() || isTyping}
            >
              {isTyping ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AITutor;

