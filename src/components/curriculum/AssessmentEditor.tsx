
import { useState, useEffect } from "react";
import { Unit } from "@/types/curriculum";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Plus, FileText, BookOpen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Assessment {
  id: string;
  title: string;
  type: "Quiz" | "Test" | "Project" | "Presentation" | "Essay";
  date?: Date;
  questions: AssessmentQuestion[];
  instructions?: string;
  timeLimit?: string;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  type: "Multiple Choice" | "Short Answer" | "Essay" | "True/False";
  options?: string[];
  correctAnswer?: string;
  points?: number;
}

interface AssessmentEditorProps {
  unit: Unit | null;
  onSave: (unit: Unit) => void;
  onCancel: () => void;
}

const AssessmentEditor = ({ unit, onSave, onCancel }: AssessmentEditorProps) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<Assessment["type"]>("Quiz");
  const [date, setDate] = useState<Date>();
  const [instructions, setInstructions] = useState<string>("");
  const [timeLimit, setTimeLimit] = useState<string>("30 minutes");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentQuestionType, setCurrentQuestionType] = useState<AssessmentQuestion["type"]>("Multiple Choice");
  const [currentOptions, setCurrentOptions] = useState<string>("");
  
  useEffect(() => {
    if (unit?.assessment) {
      setAssessment(unit.assessment);
      setTitle(unit.assessment.title);
      setType(unit.assessment.type);
      setDate(unit.assessment.date ? new Date(unit.assessment.date) : undefined);
      setInstructions(unit.assessment.instructions || "");
      setTimeLimit(unit.assessment.timeLimit || "30 minutes");
      setQuestions(unit.assessment.questions || []);
    } else {
      setTitle(unit?.name ? `${unit.name} Assessment` : "");
    }
  }, [unit]);
  
  const handleAddQuestion = () => {
    if (!currentQuestion) return;
    
    const options = currentQuestionType === "Multiple Choice" || currentQuestionType === "True/False" 
      ? currentOptions.split('\n').filter(option => option.trim() !== '')
      : [];
    
    const newQuestion: AssessmentQuestion = {
      id: uuidv4(),
      question: currentQuestion,
      type: currentQuestionType,
      options: options.length > 0 ? options : undefined,
      points: 10
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion("");
    setCurrentOptions("");
  };
  
  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const handleGenerateQuestions = () => {
    // Mock AI-generated questions
    const mockQuestions: AssessmentQuestion[] = [
      {
        id: uuidv4(),
        question: "What is the main property of linear equations?",
        type: "Multiple Choice",
        options: [
          "They always form a straight line when graphed",
          "They always have exactly one variable",
          "They always have a degree of 2",
          "They cannot have negative coefficients"
        ],
        points: 10
      },
      {
        id: uuidv4(),
        question: "Solve for x: 2x + 5 = 15",
        type: "Short Answer",
        points: 10
      },
      {
        id: uuidv4(),
        question: "True or False: The slope of a vertical line is undefined.",
        type: "True/False",
        options: ["True", "False"],
        points: 5
      }
    ];
    
    setQuestions([...questions, ...mockQuestions]);
  };
  
  const handleSubmit = () => {
    if (!title || !type) return;
    
    const newAssessment: Assessment = {
      id: assessment?.id || uuidv4(),
      title,
      type,
      date,
      questions,
      instructions,
      timeLimit
    };
    
    if (!unit) return;
    
    const updatedUnit = {
      ...unit,
      assessment: newAssessment
    };
    
    onSave(updatedUnit);
  };
  
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="assessment-title">Assessment Title</Label>
        <Input 
          id="assessment-title" 
          placeholder="e.g. Unit Test: Algebraic Expressions" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assessment-type">Assessment Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="assessment-type">
              <SelectValue placeholder="Select assessment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quiz">Quiz</SelectItem>
              <SelectItem value="Test">Test</SelectItem>
              <SelectItem value="Project">Project</SelectItem>
              <SelectItem value="Presentation">Presentation</SelectItem>
              <SelectItem value="Essay">Essay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Assessment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time-limit">Time Limit</Label>
          <Select value={timeLimit} onValueChange={setTimeLimit}>
            <SelectTrigger id="time-limit">
              <SelectValue placeholder="Select time limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15 minutes">15 minutes</SelectItem>
              <SelectItem value="30 minutes">30 minutes</SelectItem>
              <SelectItem value="45 minutes">45 minutes</SelectItem>
              <SelectItem value="1 hour">1 hour</SelectItem>
              <SelectItem value="1.5 hours">1.5 hours</SelectItem>
              <SelectItem value="2 hours">2 hours</SelectItem>
              <SelectItem value="No limit">No time limit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea 
          id="instructions" 
          placeholder="Enter instructions for students taking this assessment..." 
          className="min-h-[100px]"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-4">Questions</h3>
        
        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={question.id} className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Q{index + 1}.</span>
                      <span>{question.question}</span>
                      <span className="ml-2 text-xs text-gray-500">[{question.type}]</span>
                      <span className="ml-2 text-xs text-gray-500">{question.points} pts</span>
                    </div>
                    
                    {question.options && (
                      <div className="ml-6 mt-2 space-y-1">
                        {question.options.map((option, i) => (
                          <div key={i} className="text-sm flex items-center">
                            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border mr-2 text-xs">
                              {['A', 'B', 'C', 'D', 'E'][i]}
                            </span>
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-500 h-6 hover:text-red-500"
                    onClick={() => handleRemoveQuestion(question.id)}
                  >
                    ✕
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {questions.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No questions added yet
            </div>
          )}
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                  <Select value={currentQuestionType} onValueChange={setCurrentQuestionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="Short Answer">Short Answer</SelectItem>
                      <SelectItem value="Essay">Essay</SelectItem>
                      <SelectItem value="True/False">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-9">
                  <Input 
                    placeholder="Enter question" 
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                  />
                </div>
              </div>
              
              {(currentQuestionType === "Multiple Choice" || currentQuestionType === "True/False") && (
                <div>
                  <Textarea 
                    placeholder={
                      currentQuestionType === "True/False" 
                        ? "True\nFalse" 
                        : "Enter answer choices (one per line)"
                    }
                    className="min-h-[80px]"
                    value={currentOptions}
                    onChange={(e) => setCurrentOptions(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each option on a new line</p>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="bg-lms-purple/20 hover:bg-lms-purple/40 flex items-center"
                  onClick={handleGenerateQuestions}
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5749C2.02502 13.8073 2.21269 13.9949 2.44503 13.9949C2.67736 13.9949 2.86502 13.8073 2.86502 13.5749C2.86502 11.8854 3.31568 10.6764 4.07077 9.92324C4.82298 9.17301 5.91298 8.77501 7.49996 8.77501C9.08694 8.77501 10.1769 9.17301 10.9292 9.92324C11.6842 10.6764 12.1349 11.8854 12.1349 13.5749C12.1349 13.8073 12.3226 13.9949 12.5549 13.9949C12.7872 13.9949 12.9749 13.8073 12.9749 13.5749C12.9749 11.72 12.4778 10.2794 11.4959 9.31167C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.625 4.5C4.625 2.91228 5.91228 1.625 7.5 1.625C9.08772 1.625 10.375 2.91228 10.375 4.5C10.375 6.08772 9.08772 7.375 7.5 7.375C5.91228 7.375 4.625 6.08772 4.625 4.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Generate Sample Questions
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex items-center"
                  onClick={handleAddQuestion}
                  disabled={!currentQuestion}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          disabled={!title || !type || questions.length === 0}
          className="bg-lms-green hover:bg-lms-green/80 text-secondary-foreground"
        >
          Save Assessment
        </Button>
      </div>
    </div>
  );
};

export default AssessmentEditor;
