
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  Brain, 
  HelpCircle,
  FileText,
  Send,
  BookCheck,
  Plus
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AIToolsPanelProps {
  highlightedText: string;
  currentPage: number;
  chapterTitle: string;
  subjectName: string;
}

const AIToolsPanel = ({ 
  highlightedText, 
  currentPage,
  chapterTitle,
  subjectName
}: AIToolsPanelProps) => {
  const [activeTab, setActiveTab] = useState("ask");
  const [question, setQuestion] = useState("");
  const [helpQuestion, setHelpQuestion] = useState("");
  const [noteContent, setNoteContent] = useState("");
  
  const handleAskAI = () => {
    // This would integrate with an actual AI API
    console.log("Asking AI:", question);
    setQuestion("");
  };
  
  const handleAddToHelpQueue = () => {
    console.log("Adding to help queue:", helpQuestion);
    setHelpQuestion("");
  };
  
  // Generate mock flashcards for the current chapter
  const getMockFlashcards = () => {
    if (subjectName === "Mathematics") {
      return [
        { front: "What is a real number?", back: "A value that represents a quantity along a continuous line." },
        { front: "What types of numbers are included in the set of real numbers?", back: "Natural numbers, whole numbers, integers, rational numbers, and irrational numbers." },
        { front: "Give an example of an irrational number.", back: "√2, π, e" }
      ];
    }
    
    if (subjectName === "Science") {
      return [
        { front: "What is a chemical reaction?", back: "A process that involves rearrangement of atoms to form new substances." },
        { front: "What are the signs of a chemical reaction?", back: "Change in state, change in color, evolution of gas, change in temperature." },
        { front: "What is a balanced chemical equation?", back: "An equation with equal number of atoms of each element on both sides." }
      ];
    }
    
    return [
      { front: `Flashcard 1 for ${chapterTitle}`, back: "Definition or explanation here." },
      { front: `Flashcard 2 for ${chapterTitle}`, back: "Definition or explanation here." }
    ];
  };
  
  // Generate mock quiz questions for the current chapter
  const getMockQuizQuestions = () => {
    if (subjectName === "Mathematics") {
      return [
        { 
          question: "Which of the following is an irrational number?", 
          options: ["22/7", "√4", "√3", "0.75"],
          answer: "√3"
        },
        {
          question: "The decimal expansion of rational numbers is:",
          options: ["Always terminating", "Always non-terminating", "Either terminating or repeating non-terminating", "None of these"],
          answer: "Either terminating or repeating non-terminating"
        }
      ];
    }
    
    if (subjectName === "Science") {
      return [
        { 
          question: "In the reaction: 2H₂ + O₂ → 2H₂O, how many molecules of H₂ are needed?", 
          options: ["1", "2", "3", "4"],
          answer: "2"
        },
        {
          question: "The formation of rust from iron is an example of:",
          options: ["Combination reaction", "Decomposition reaction", "Displacement reaction", "Redox reaction"],
          answer: "Redox reaction"
        }
      ];
    }
    
    return [
      { 
        question: `Question 1 about ${chapterTitle}`, 
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option C"
      },
      { 
        question: `Question 2 about ${chapterTitle}`, 
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A"
      }
    ];
  };

  return (
    <Card className="h-full">
      <Tabs 
        defaultValue="ask" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <div className="border-b px-3">
          <TabsList className="h-12 w-full flex-nowrap">
            <TabsTrigger value="ask" className="flex flex-col gap-1 h-full flex-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Ask AI</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex flex-col gap-1 h-full flex-1">
              <BookCheck className="h-4 w-4" />
              <span className="text-xs">Flashcards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex flex-col gap-1 h-full flex-1">
              <Brain className="h-4 w-4" />
              <span className="text-xs">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex flex-col gap-1 h-full flex-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="help" className="flex flex-col gap-1 h-full flex-1">
              <HelpCircle className="h-4 w-4" />
              <span className="text-xs">Help</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="ask" className="h-full flex flex-col mt-0">
            <div className="bg-blue-50 p-3 rounded-md mb-3">
              <h3 className="font-medium text-blue-800">AI Teacher Assistant</h3>
              <p className="text-sm text-blue-600 mt-1">
                Ask me any question about {chapterTitle} or request explanations for concepts.
              </p>
            </div>
            
            <div className="flex-1 overflow-auto mb-3 space-y-3">
              <div className="bg-white p-3 rounded-md border">
                <p className="text-sm">
                  <span className="font-medium">Topic explanation:</span> In the chapter on Real Numbers, 
                  we explore the fundamental properties of numbers that form the basis of mathematics.
                </p>
                <p className="text-sm mt-2">
                  Real numbers include both rational and irrational numbers. A rational number can be 
                  expressed as a fraction p/q where p and q are integers and q ≠ 0. Examples include 
                  1/2, 3.75, and -6.
                </p>
                <p className="text-sm mt-2">
                  Irrational numbers cannot be expressed as fractions. Examples include √2, π, and e. 
                  These numbers have decimal expansions that neither terminate nor repeat.
                </p>
              </div>
            </div>
            
            <div className="space-y-2 mt-auto">
              <Textarea
                placeholder="Ask your AI teacher..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] bg-white"
              />
              
              <Button 
                className="w-full"
                onClick={handleAskAI}
                disabled={!question.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Ask AI Teacher
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="flashcards" className="h-full mt-0">
            <div className="bg-purple-50 p-3 rounded-md mb-3">
              <h3 className="font-medium text-purple-800">Flashcards</h3>
              <p className="text-sm text-purple-600 mt-1">
                Review key concepts from {chapterTitle} with these flashcards.
              </p>
            </div>
            
            <div className="space-y-4 mb-3">
              {getMockFlashcards().map((card, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-md border overflow-hidden cursor-pointer group"
                >
                  <div className="p-3 border-b bg-purple-50 font-medium">
                    {card.front}
                  </div>
                  <div className="p-3 bg-white text-sm">
                    {card.back}
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-auto">
              <Plus className="h-4 w-4 mr-2" />
              Generate More Flashcards
            </Button>
          </TabsContent>
          
          <TabsContent value="quiz" className="h-full mt-0">
            <div className="bg-green-50 p-3 rounded-md mb-3">
              <h3 className="font-medium text-green-800">Quick Quiz</h3>
              <p className="text-sm text-green-600 mt-1">
                Test your knowledge of {chapterTitle} with these questions.
              </p>
            </div>
            
            <div className="space-y-6 mb-3">
              {getMockQuizQuestions().map((question, index) => (
                <div key={index} className="bg-white rounded-md border overflow-hidden">
                  <div className="p-3 border-b bg-green-50">
                    <div className="font-medium">{question.question}</div>
                  </div>
                  <div className="p-3">
                    {question.options.map((option, i) => (
                      <div 
                        key={i} 
                        className={`p-2 my-1 rounded-md cursor-pointer
                          ${option === question.answer 
                            ? 'bg-green-100 border border-green-300' 
                            : 'hover:bg-gray-100 border border-transparent'}`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-auto">
              <Plus className="h-4 w-4 mr-2" />
              Generate More Questions
            </Button>
          </TabsContent>
          
          <TabsContent value="notes" className="h-full flex flex-col mt-0">
            <div className="bg-orange-50 p-3 rounded-md mb-3">
              <h3 className="font-medium text-orange-800">Live Notes</h3>
              <p className="text-sm text-orange-600 mt-1">
                Take notes as you read through page {currentPage} of {chapterTitle}.
              </p>
            </div>
            
            <div className="flex-1 mb-3">
              <Textarea
                placeholder="Start taking notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="min-h-[200px] bg-white"
              />
            </div>
            
            <Button 
              className="w-full mt-auto"
              disabled={!highlightedText || !noteContent}
            >
              <Plus className="h-4 w-4 mr-2" />
              Link Note to Highlight
            </Button>
          </TabsContent>
          
          <TabsContent value="help" className="h-full flex flex-col mt-0">
            <div className="bg-red-50 p-3 rounded-md mb-3">
              <h3 className="font-medium text-red-800">Need Help</h3>
              <p className="text-sm text-red-600 mt-1">
                Add questions for your teacher to cover in the next class.
              </p>
            </div>
            
            <div className="flex-1 mb-3">
              <Textarea
                placeholder="Enter a question you want your teacher to cover in the next class..."
                value={helpQuestion}
                onChange={(e) => setHelpQuestion(e.target.value)}
                className="min-h-[200px] bg-white"
              />
            </div>
            
            <Button 
              className="w-full mt-auto"
              onClick={handleAddToHelpQueue}
              disabled={!helpQuestion.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Help Queue
            </Button>
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default AIToolsPanel;
