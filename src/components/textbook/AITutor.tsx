
import { useState, useEffect } from "react";
import { DikshaTextbook } from "@/types/curriculum";
import { TutorMode, TutorQuestion, TutorResponse, AITutorContext } from "@/types/tutor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
  const [currentPage, setCurrentPage] = useState<string | undefined>(undefined);
  const [conversation, setConversation] = useState<TutorQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, TutorResponse>>({});

  const currentMode = TUTOR_MODES.find(m => m.mode === mode)!;

  // Extract context information from the textbook
  const tutorContext: AITutorContext = {
    subject: textbook.subject[0] || "",
    gradeLevel: textbook.gradeLevel[0] || "",
    currentTopic: textbook.name,
    currentPage
  };

  // Detect if PDF is loaded
  useEffect(() => {
    // Monitor if textbook has a pdfUrl
    if (textbook.pdfUrl) {
      console.log("PDF textbook loaded:", textbook.pdfUrl);
      setCurrentPage("Page 1"); // Default to first page
      
      // If textbook changes, reset conversation
      setConversation([]);
      setResponses({});
      
      // Auto-ask about the first page
      if (mode === 'explain') {
        setTimeout(() => {
          handleSendQuestion("Please explain this page.");
        }, 500);
      }
    }
  }, [textbook.identifier]);

  const handleSendQuestion = async (questionText = question) => {
    if (!questionText.trim()) return;

    setIsTyping(true);
    const newQuestion: TutorQuestion = {
      question: questionText.trim(),
      timestamp: new Date(),
      mode
    };

    const questionId = `q-${Date.now()}`;
    setConversation(prev => [...prev, newQuestion]);
    
    try {
      // Simulate API request to AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response based on mode
      const mockResponse = generateMockResponse(newQuestion, tutorContext);
      
      setResponses(prev => ({
        ...prev,
        [questionId]: mockResponse
      }));
      
      toast.success("AI tutor response generated", {
        description: `Responded to your ${mode} request`
      });
    } catch (error) {
      toast.error("Unable to process your question");
      console.error("Tutor response error:", error);
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Math Tutor
          </div>
          {currentPage && (
            <Badge variant="outline" className="text-xs">
              {currentPage}
            </Badge>
          )}
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
                onClick={() => {
                  setMode(tutorMode.mode);
                  if (tutorMode.mode === 'explain' && currentPage) {
                    handleSendQuestion(`Please explain ${currentPage}.`);
                  }
                }}
              >
                <Icon className="h-4 w-4" />
                {tutorMode.label}
              </Button>
            );
          })}
        </div>

        <ScrollArea className="h-[300px] rounded-md border bg-white/80 p-4">
          {conversation.length === 0 ? (
            <div className="text-sm text-gray-600 p-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">CBSE Class 10 Mathematics AI Tutor</h3>
                <p className="text-blue-700">{currentMode.description}</p>
              </div>
              
              <div className="mt-4 text-gray-500">
                {textbook.pdfUrl ? 
                  "I'm currently looking at the textbook content displayed below. Ask me about anything you see on this page!" :
                  "Select a specific textbook page to get more targeted help."
                }
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {conversation.map((q, i) => {
                const responseId = `q-${Date.now() - (conversation.length - i) * 1000}`;
                const response = responses[responseId];
                
                return (
                  <div key={i} className="text-sm space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg rounded-bl-none border border-blue-100">
                      <div className="font-medium text-blue-800">You asked:</div>
                      <div className="mt-1 text-gray-700">{q.question}</div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">
                          {q.mode} mode
                        </Badge>
                        {new Date(q.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {response && (
                      <div className="bg-gray-50 p-3 rounded-lg rounded-br-none border border-gray-100">
                        <div className="prose prose-sm max-w-none">
                          {response.type === 'text' ? (
                            <div dangerouslySetInnerHTML={{ __html: formatTutorResponse(response.content) }} />
                          ) : response.type === 'example' ? (
                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                              <div className="font-medium mb-1">Example:</div>
                              <div dangerouslySetInnerHTML={{ __html: formatTutorResponse(response.content) }} />
                            </div>
                          ) : (
                            <div className="bg-green-50 p-3 rounded border border-green-200">
                              <div className="font-medium mb-1">Visual Explanation:</div>
                              <div dangerouslySetInnerHTML={{ __html: formatTutorResponse(response.content) }} />
                            </div>
                          )}
                          
                          {response.relatedConcepts && response.relatedConcepts.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="text-xs text-gray-500 mb-1">Related concepts:</div>
                              <div className="flex flex-wrap gap-1">
                                {response.relatedConcepts.map((concept, i) => (
                                  <Badge 
                                    key={i}
                                    variant="secondary"
                                    className="text-[10px] cursor-pointer"
                                    onClick={() => handleSendQuestion(`Tell me about ${concept}`)}
                                  >
                                    {concept}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 text-sm p-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                  </div>
                  <div>AI Tutor is typing...</div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Ask about ${textbook.name}...`}
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
              onClick={() => handleSendQuestion()}
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

// Helper function to format tutor response with basic HTML
const formatTutorResponse = (content: string): string => {
  // Replace line breaks with paragraph tags
  let formatted = content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  
  // Wrap in paragraphs if not already
  if (!formatted.startsWith('<p>')) {
    formatted = `<p>${formatted}</p>`;
  }

  return formatted;
};

// Generate mock responses based on the question and mode
const generateMockResponse = (question: TutorQuestion, context: AITutorContext): TutorResponse => {
  const { mode } = question;
  
  // Default response
  let content = "I'm sorry, I don't have specific information about this topic yet.";
  let type: TutorResponse['type'] = 'text';
  const relatedConcepts: string[] = [];
  
  // Math-specific responses for Class 10
  if (context.subject.toLowerCase().includes('math') && context.gradeLevel.includes('10')) {
    if (mode === 'explain') {
      if (question.question.toLowerCase().includes('page')) {
        content = `This page introduces the concept of polynomials in Class 10 Mathematics. A polynomial is an expression of the form ax^n + bx^(n-1) + ... + k, where a, b, ..., k are constants and n is a non-negative integer.<br><br>The page covers:<br>- Definition of polynomials<br>- Degree of polynomials<br>- Types of polynomials (linear, quadratic, cubic)<br>- Zeros/roots of polynomials<br>- Relationship between zeros and coefficients`;
        relatedConcepts.push('Polynomial Division', 'Quadratic Equations', 'Factorization');
      }
    } else if (mode === 'question') {
      if (question.question.toLowerCase().includes('polynomial')) {
        content = `In the context of polynomials, a "zero" or "root" is a value of x for which the polynomial equals zero. For example, in the polynomial p(x) = x² - 5x + 6, the zeros are x = 2 and x = 3 because p(2) = 0 and p(3) = 0.<br><br>To find zeros, you can:<br>1. Factor the polynomial<br>2. Use the quadratic formula for quadratic polynomials<br>3. Apply graphical methods`;
        type = 'text';
        relatedConcepts.push('Factor Theorem', 'Polynomial Division', 'Quadratic Formula');
      } else if (question.question.toLowerCase().includes('real numbers')) {
        content = `Real numbers include all rational and irrational numbers. Rational numbers can be written as a fraction (p/q where q≠0), while irrational numbers cannot be expressed as a fraction.<br><br>Examples:<br>- Rational numbers: 1/2, 3.75, -6<br>- Irrational numbers: √2, π, e`;
        type = 'text';
        relatedConcepts.push('Rational Numbers', 'Irrational Numbers', 'Number Line');
      } else {
        content = `I'll be happy to answer your question about ${question.question}. In CBSE Class 10 Mathematics, this topic is related to chapter ${Math.floor(Math.random() * 10) + 1}. Could you specify which particular aspect you need help with?`;
      }
    } else if (mode === 'help') {
      content = `Let me explain this with a visual approach:<br><br>Imagine a polynomial like x² - 5x + 6.<br><br>We can represent this visually as a parabola on a graph. The points where this parabola crosses the x-axis are the zeros or roots.<br><br>The relationship between the roots and the coefficients is: if α and β are the roots, then:<br>- Sum of roots: α + β = 5 (coefficient of x with sign changed)<br>- Product of roots: α × β = 6 (constant term)`;
      type = 'visualization';
      relatedConcepts.push('Graphing Polynomials', 'Vieta\'s Formulas');
    } else if (mode === 'practice') {
      content = `Let's practice with an example:<br><br><strong>Problem:</strong> Find the zeros of the polynomial p(x) = x² - 7x + 12<br><br><strong>Solution:</strong><br>Step 1: Factor the polynomial.<br>p(x) = x² - 7x + 12<br>p(x) = (x - 3)(x - 4)<br><br>Step 2: Set each factor equal to zero.<br>x - 3 = 0 → x = 3<br>x - 4 = 0 → x = 4<br><br>Step 3: Verify.<br>p(3) = 3² - 7(3) + 12 = 9 - 21 + 12 = 0 ✓<br>p(4) = 4² - 7(4) + 12 = 16 - 28 + 12 = 0 ✓<br><br>Therefore, the zeros of p(x) are x = 3 and x = 4.<br><br>Now try this one: Find the zeros of p(x) = x² - x - 6`;
      type = 'example';
      relatedConcepts.push('Factorization Techniques', 'Polynomial Equations');
    }
  }
  
  return {
    content,
    type,
    relatedConcepts: relatedConcepts.length ? relatedConcepts : undefined
  };
};

export default AITutor;
